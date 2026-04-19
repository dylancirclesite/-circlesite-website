"""
CircleSite API Tests
Tests for contact form submission, health check, and submissions listing
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestHealthAndRoot:
    """Tests for root and health endpoints"""
    
    def test_root_returns_200_with_message(self):
        """GET /api/ returns 200 OK with message"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert data.get("ok") == True
        print(f"✓ Root endpoint: {data}")
    
    def test_health_returns_ok_with_resend_flag(self):
        """GET /api/health returns ok status with resend_configured flag"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data.get("status") == "ok"
        assert "resend_configured" in data
        # Since RESEND_API_KEY is empty, resend_configured should be False
        assert data.get("resend_configured") == False
        assert data.get("recipient") == "hello@circlesite.uk"
        print(f"✓ Health endpoint: {data}")


class TestContactSubmission:
    """Tests for contact form submission endpoint"""
    
    def test_contact_valid_submission_returns_200(self):
        """POST /api/contact with valid data returns 200 with ok=true and id"""
        unique_id = str(uuid.uuid4())[:8]
        payload = {
            "name": f"TEST_User_{unique_id}",
            "email": f"test_{unique_id}@example.com",
            "message": f"Test message from automated testing - {unique_id}"
        }
        response = requests.post(f"{BASE_URL}/api/contact", json=payload)
        assert response.status_code == 200
        data = response.json()
        
        # Verify response structure
        assert data.get("ok") == True
        assert "id" in data
        assert isinstance(data["id"], str)
        assert len(data["id"]) > 0
        
        # email_sent should be False since RESEND_API_KEY is empty (expected behavior)
        assert data.get("email_sent") == False
        assert "message" in data
        print(f"✓ Contact submission: id={data['id']}, email_sent={data['email_sent']}")
        
        return data["id"]
    
    def test_contact_invalid_email_returns_422(self):
        """POST /api/contact with invalid email returns 422"""
        payload = {
            "name": "Test User",
            "email": "not-an-email",  # Invalid email format
            "message": "Test message"
        }
        response = requests.post(f"{BASE_URL}/api/contact", json=payload)
        assert response.status_code == 422
        print(f"✓ Invalid email rejected with 422")
    
    def test_contact_empty_name_returns_422(self):
        """POST /api/contact with empty name returns 422"""
        payload = {
            "name": "",  # Empty name
            "email": "test@example.com",
            "message": "Test message"
        }
        response = requests.post(f"{BASE_URL}/api/contact", json=payload)
        assert response.status_code == 422
        print(f"✓ Empty name rejected with 422")
    
    def test_contact_empty_message_returns_422(self):
        """POST /api/contact with empty message returns 422"""
        payload = {
            "name": "Test User",
            "email": "test@example.com",
            "message": ""  # Empty message
        }
        response = requests.post(f"{BASE_URL}/api/contact", json=payload)
        assert response.status_code == 422
        print(f"✓ Empty message rejected with 422")
    
    def test_contact_missing_fields_returns_422(self):
        """POST /api/contact with missing fields returns 422"""
        # Missing message field
        payload = {
            "name": "Test User",
            "email": "test@example.com"
        }
        response = requests.post(f"{BASE_URL}/api/contact", json=payload)
        assert response.status_code == 422
        print(f"✓ Missing fields rejected with 422")


class TestContactSubmissions:
    """Tests for contact submissions listing endpoint"""
    
    def test_submissions_returns_list_without_id_leak(self):
        """GET /api/contact/submissions returns stored submissions without _id"""
        # First create a submission to ensure there's data
        unique_id = str(uuid.uuid4())[:8]
        payload = {
            "name": f"TEST_ListUser_{unique_id}",
            "email": f"listtest_{unique_id}@example.com",
            "message": f"Test message for listing - {unique_id}"
        }
        create_response = requests.post(f"{BASE_URL}/api/contact", json=payload)
        assert create_response.status_code == 200
        created_id = create_response.json()["id"]
        
        # Now fetch submissions
        response = requests.get(f"{BASE_URL}/api/contact/submissions")
        assert response.status_code == 200
        data = response.json()
        
        # Verify response structure
        assert "items" in data
        assert "count" in data
        assert isinstance(data["items"], list)
        assert data["count"] >= 1
        
        # Verify no _id leak in any item
        for item in data["items"]:
            assert "_id" not in item, "MongoDB _id should not be exposed"
            # Verify expected fields exist
            assert "id" in item
            assert "name" in item
            assert "email" in item
            assert "message" in item
            assert "created_at" in item
            assert "email_sent" in item
        
        # Verify our created submission is in the list
        found = any(item["id"] == created_id for item in data["items"])
        assert found, f"Created submission {created_id} should be in the list"
        
        print(f"✓ Submissions list: {data['count']} items, no _id leak")
    
    def test_submissions_with_limit_parameter(self):
        """GET /api/contact/submissions?limit=N respects limit"""
        response = requests.get(f"{BASE_URL}/api/contact/submissions?limit=2")
        assert response.status_code == 200
        data = response.json()
        assert len(data["items"]) <= 2
        print(f"✓ Submissions limit parameter works: {len(data['items'])} items returned")


class TestDataPersistence:
    """Tests to verify data is actually saved to MongoDB"""
    
    def test_submission_persists_to_database(self):
        """Verify submission is saved to MongoDB and can be retrieved"""
        unique_id = str(uuid.uuid4())[:8]
        payload = {
            "name": f"TEST_Persist_{unique_id}",
            "email": f"persist_{unique_id}@example.com",
            "message": f"Persistence test message - {unique_id}"
        }
        
        # Create submission
        create_response = requests.post(f"{BASE_URL}/api/contact", json=payload)
        assert create_response.status_code == 200
        created_id = create_response.json()["id"]
        
        # Fetch submissions and verify our data is there
        list_response = requests.get(f"{BASE_URL}/api/contact/submissions?limit=50")
        assert list_response.status_code == 200
        items = list_response.json()["items"]
        
        # Find our submission
        our_submission = next((item for item in items if item["id"] == created_id), None)
        assert our_submission is not None, "Submission should be persisted in database"
        
        # Verify all fields match
        assert our_submission["name"] == payload["name"]
        assert our_submission["email"] == payload["email"]
        assert our_submission["message"] == payload["message"]
        assert our_submission["email_sent"] == False  # Expected since no Resend key
        
        print(f"✓ Data persistence verified for submission {created_id}")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
