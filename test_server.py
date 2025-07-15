import requests

# Test data
test_data = {
    "original_selector": "#loginButton",
    "html_content": """
    <div class="login-container">
        <form>
            <input type="text" class="form-input" id="username" />
            <input type="password" class="form-input" id="password" />
            <button type="submit" class="btn-submit" data-testid="submitBtn">Login</button>
        </form>
    </div>
    """,
    "element_attributes": {
        "type": "submit",
        "class": "btn-submit",
        "data-testid": "submitBtn"
    }
}

def test_healing():
    # Test health check
    health_response = requests.get("http://localhost:8000/api/health")
    print("Health check response:", health_response.json())

    # Test element healing
    healing_response = requests.post(
        "http://localhost:8000/api/heal-element",
        json=test_data
    )
    print("\nHealing response:", healing_response.json())

if __name__ == "__main__":
    test_healing()
