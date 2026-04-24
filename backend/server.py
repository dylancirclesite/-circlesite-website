from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import resend


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

#  config
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '').strip()
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
CONTACT_RECIPIENT = os.environ.get('CONTACT_RECIPIENT', 'hello@circlesite.uk')
if RESEND_API_KEY:
    resend.api_key = re_AfWw3Mak_5qmZxy3ZzofZZQWScZJkTVeD

# Create the main app without a prefix
app = FastAPI(title="CircleSite API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ---------- Models ----------
class ContactRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    email: EmailStr
    message: str = Field(..., min_length=1, max_length=5000)


class ContactRecord(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    email_sent: bool = False
    email_id: Optional[str] = None


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "CircleSite API is running", "ok": True}


@api_router.get("/health")
async def health():
    return {
        "status": "ok",
        "resend_configured": bool(RESEND_API_KEY),
        "recipient": CONTACT_RECIPIENT,
    }


def _build_email_html(name: str, email: str, message: str) -> str:
    safe_msg = message.replace("<", "&lt;").replace(">", "&gt;").replace("\n", "<br>")
    return f"""
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, Helvetica, sans-serif; background:#FDFBF7; padding:24px;">
      <tr><td>
        <table width="600" cellpadding="0" cellspacing="0" align="center" style="background:#ffffff; border:1px solid #E2DCD0; border-radius:12px; padding:32px;">
          <tr><td>
            <p style="margin:0 0 8px; color:#C49A45; font-size:12px; letter-spacing:2px; text-transform:uppercase; font-weight:bold;">New Enquiry</p>
            <h1 style="margin:0 0 24px; color:#0A1128; font-size:24px;">CircleSite — Website Review Request</h1>
            <p style="margin:0 0 6px; color:#475569; font-size:13px;"><strong style="color:#0A1128;">Name:</strong> {name}</p>
            <p style="margin:0 0 6px; color:#475569; font-size:13px;"><strong style="color:#0A1128;">Email:</strong> <a href="mailto:{email}" style="color:#C49A45; text-decoration:none;">{email}</a></p>
            <hr style="border:none; border-top:1px solid #E2DCD0; margin:20px 0;">
            <p style="margin:0 0 8px; color:#0A1128; font-size:14px; font-weight:bold;">Message</p>
            <p style="margin:0; color:#475569; font-size:14px; line-height:1.6;">{safe_msg}</p>
          </td></tr>
        </table>
        <p style="text-align:center; color:#94a3b8; font-size:11px; margin-top:16px;">Sent from circlesite.uk contact form</p>
      </td></tr>
    </table>
    """


@api_router.post("/contact")
async def submit_contact(req: ContactRequest):
    # Always save to DB first (backup, never lose a lead)
    record = ContactRecord(name=req.name, email=req.email, message=req.message)
    doc = record.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()

    email_sent = False
    email_id: Optional[str] = None
    email_error: Optional[str] = None

    if RESEND_API_KEY:
        try:
            params = {
                "from": f"CircleSite <{SENDER_EMAIL}>",
                "to": [CONTACT_RECIPIENT],
                "reply_to": req.email,
                "subject": f"New website enquiry from {req.name}",
                "html": _build_email_html(req.name, req.email, req.message),
            }
            result = await asyncio.to_thread(resend.Emails.send, params)
            email_id = result.get("id") if isinstance(result, dict) else None
            email_sent = True
        except Exception as e:
            logger.error(f"Resend send failed: {e}")
            email_error = str(e)

    doc['email_sent'] = email_sent
    doc['email_id'] = email_id

    await db.contact_submissions.insert_one(doc)

    return {
        "ok": True,
        "id": record.id,
        "email_sent": email_sent,
        "email_error": email_error,
        "message": "Thanks! We'll be in touch shortly.",
    }


@api_router.get("/contact/submissions")
async def list_submissions(limit: int = 50):
    """Admin-style listing. Excludes _id."""
    items = await db.contact_submissions.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    return {"items": items, "count": len(items)}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
