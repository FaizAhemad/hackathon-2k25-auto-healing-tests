import requests
from typing import Dict, Any

def test_healing(test_case: Dict[str, Any]) -> None:
    """Run a test case and print results"""
    print(f"\nTesting: {test_case['name']}")
    print("=" * 50)
    
    response = requests.post(
        "http://localhost:8000/api/heal-element",
        json=test_case['data']
    )
    result = response.json()
    
    print(f"Status: {result['status']}")
    print(f"Success: {result['success']}")
    if result['healed_selector']:
        print(f"Healed Selector: {result['healed_selector']}")
    if result['explanation']:
        print(f"Explanation: {result['explanation']}")
    if result['error']:
        print(f"Error: {result['error']}")
    if result['jira_url']:
        print(f"JIRA Issue: {result['jira_url']}")
    print()

# Test Cases
test_cases = [
    {
        "name": "Case 1: No Change Needed (Original selector still valid)",
        "data": {
            "original_selector": "#loginBtn",
            "html_content": '<button id="loginBtn" type="submit">Login</button>',
            "element_attributes": {
                "id": "loginBtn",
                "type": "submit"
            },
            "is_visible": True,
            "exists": True
        }
    },
    {
        "name": "Case 1B: Element with Dynamic ID (React-style)",
        "data": {
            "original_selector": "#login-button-abc123",
            "html_content": '<button id="login-button-xyz789" class="login-btn" type="submit">Login</button>',
            "element_attributes": {
                "id": "login-button-xyz789",
                "class": "login-btn",
                "type": "submit"
            },
            "is_visible": True,
            "exists": True
        }
    },
    {
        "name": "Case 2: Element Hidden",
        "data": {
            "original_selector": "#submitButton",
            "html_content": '<button id="submitButton" style="display: none">Submit</button>',
            "element_attributes": {
                "id": "submitButton",
                "style": "display: none"
            },
            "is_visible": False,
            "exists": True
        }
    },
    {
        "name": "Case 3: Element Not Found",
        "data": {
            "original_selector": "#oldButton",
            "html_content": '<button id="newButton">Click Me</button>',
            "element_attributes": {},
            "is_visible": True,
            "exists": False
        }
    },
    {
        "name": "Case 4: Successful Healing (ID changed)",
        "data": {
            "original_selector": "#oldId",
            "html_content": '<button id="newId" data-testid="submit-button">Submit</button>',
            "element_attributes": {
                "id": "newId",
                "data-testid": "submit-button"
            },
            "is_visible": True,
            "exists": True
        }
    },
    {
        "name": "Case 5: Healing with Class",
        "data": {
            "original_selector": "#missingId",
            "html_content": '<button class="btn-primary submit-btn">Submit</button>',
            "element_attributes": {
                "class": "btn-primary submit-btn"
            },
            "is_visible": True,
            "exists": True
        }
    },
    {
        "name": "Case 6: Element in Shadow DOM",
        "data": {
            "original_selector": "#shadowBtn",
            "html_content": '<div id="host"><shadow-root><button class="shadow-btn">Click</button></shadow-root></div>',
            "element_attributes": {
                "class": "shadow-btn"
            },
            "is_visible": True,
            "exists": True
        }
    },
    {
        "name": "Case 7: Element in iframe",
        "data": {
            "original_selector": "#frame-button",
            "html_content": '<iframe id="myFrame"><button class="frame-btn">Submit</button></iframe>',
            "element_attributes": {
                "class": "frame-btn"
            },
            "is_visible": True,
            "exists": True
        }
    },
    {
        "name": "Case 8: Element with Multiple Classes",
        "data": {
            "original_selector": ".old-class",
            "html_content": '<button class="btn primary-btn large-btn submit-btn">Submit</button>',
            "element_attributes": {
                "class": "btn primary-btn large-btn submit-btn"
            },
            "is_visible": True,
            "exists": True
        }
    },
    {
        "name": "Case 9: Disabled Element",
        "data": {
            "original_selector": "#submitBtn",
            "html_content": '<button id="submitBtn" disabled>Submit</button>',
            "element_attributes": {
                "id": "submitBtn",
                "disabled": "true"
            },
            "is_visible": True,
            "exists": True
        }
    },
    {
        "name": "Case 10: Element with Special Characters",
        "data": {
            "original_selector": "#user@name",
            "html_content": '<input name="user@domain.com" id="user@name" type="email">',
            "element_attributes": {
                "id": "user@name",
                "name": "user@domain.com",
                "type": "email"
            },
            "is_visible": True,
            "exists": True
        }
    },
    {
        "name": "Case 11: Element with aria-label",
        "data": {
            "original_selector": "#closeBtn",
            "html_content": '<button aria-label="Close dialog" class="close-btn">×</button>',
            "element_attributes": {
                "aria-label": "Close dialog",
                "class": "close-btn"
            },
            "is_visible": True,
            "exists": True
        }
    },
    {
        "name": "Case 12: Element Inside Complex Nested Structure",
        "data": {
            "original_selector": "#nestedBtn",
            "html_content": """
                <div class="modal">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-body">
                                <button class="nested-btn">Click</button>
                            </div>
                        </div>
                    </div>
                </div>
            """,
            "element_attributes": {
                "class": "nested-btn"
            },
            "is_visible": True,
            "exists": True
        }
    },
    {
        "name": "Case 13: Element with Overlay (Not actually visible)",
        "data": {
            "original_selector": "#coveredBtn",
            "html_content": """
                <div>
                    <button id="coveredBtn">Click Me</button>
                    <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0;">Loading...</div>
                </div>
            """,
            "element_attributes": {
                "id": "coveredBtn"
            },
            "is_visible": False,
            "exists": True
        }
    },
    {
        "name": "Case 14: Element in Responsive Layout (Mobile vs Desktop)",
        "data": {
            "original_selector": "#menuBtn",
            "html_content": """
                <div class="navbar">
                    <button class="hamburger-menu d-block d-md-none">☰</button>
                    <nav class="nav-links d-none d-md-flex">Menu Items</nav>
                </div>
            """,
            "element_attributes": {
                "class": "hamburger-menu d-block d-md-none"
            },
            "is_visible": True,
            "exists": True
        }
    }
]

if __name__ == "__main__":
    print("Running Element Healing Tests")
    print("=" * 50)
    
    for test_case in test_cases:
        test_healing(test_case)
