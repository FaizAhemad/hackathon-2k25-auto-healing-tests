from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import json
from typing import Dict, Optional

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ollama configuration
OLLAMA_BASE_URL = "http://localhost:11434"
MODEL_NAME = "codellama"  # or any other model you prefer

class ElementData(BaseModel):
    original_selector: str
    html_content: str
    element_attributes: Dict[str, str]
    is_visible: bool = True
    exists: bool = True

class HealingResponse(BaseModel):
    success: bool
    status: str  # "PASSED", "HEALED", "FAILED", "NO_CHANGE"
    healed_selector: Optional[str] = None
    explanation: Optional[str] = None
    info: Optional[str] = None  # For additional context like visibility state
    error: Optional[str] = None
    jira_url: Optional[str] = None

def create_jira_issue(test_name: str, error_details: str, element_data: ElementData) -> str:
    """Simulate creating a JIRA issue"""
    # In a real implementation, this would create an actual JIRA ticket
    issue_description = f"""
    Test: {test_name}
    Original Selector: {element_data.original_selector}
    Error: {error_details}
    Element State:
    - Exists: {element_data.exists}
    - Visible: {element_data.is_visible}
    - Attributes: {element_data.element_attributes}
    HTML Context: {element_data.html_content}
    """
    return f"https://jira.example.com/browse/TEST-{hash(issue_description) % 1000}"

def find_best_selector(data: ElementData) -> dict:
    """
    Find the best selector using a simple heuristic approach
    Returns a dict with status and selector info
    """
    if not data.exists:
        return {
            "status": "FAILED",
            "selector": None,
            "error": "Element does not exist in the DOM"
        }
    
    # Quick check if original selector exactly matches
    original_id = data.original_selector.startswith('#') and data.original_selector[1:]
    if original_id and original_id in data.element_attributes.get('id', ''):
        # If element exists but is hidden, we'll still use the selector but indicate visibility state
        if not data.is_visible:
            return {
                "status": "NO_CHANGE",
                "selector": data.original_selector,
                "info": "Element exists but is not visible",
                "error": None
            }
        return {
            "status": "NO_CHANGE",
            "selector": data.original_selector,
            "error": None
        }
    
    attrs = data.element_attributes
    
    # Try to find a new selector
    if 'data-testid' in attrs:
        return {
            "status": "HEALED",
            "selector": f'[data-testid="{attrs["data-testid"]}"]',
            "error": None
        }
    
    if 'id' in attrs:
        return {
            "status": "HEALED",
            "selector": f'#{attrs["id"]}',
            "error": None
        }
    
    if 'class' in attrs:
        classes = attrs['class'].split()
        if classes:
            return {
                "status": "HEALED",
                "selector": f'.{classes[0]}',
                "error": None
            }
    
    # If no good selector found
    return {
        "status": "FAILED",
        "selector": None,
        "error": "Could not find a reliable selector"
    }

@app.post("/api/heal-element", response_model=HealingResponse)
async def heal_element(data: ElementData):
    try:
        # Use heuristic-based approach
        result = find_best_selector(data)
        
        if result["status"] == "FAILED":
            # Create JIRA issue for failures
            jira_url = create_jira_issue(
                "Element Healing",
                result["error"],
                data
            )
            return HealingResponse(
                success=False,
                status=result["status"],
                healed_selector=None,
                explanation=result["error"],
                error=result["error"],
                jira_url=jira_url
            )
        
        if result["status"] == "NO_CHANGE":
            return HealingResponse(
                success=True,
                status=result["status"],
                healed_selector=result["selector"],
                info=result.get("info"),  # Include visibility state info if present
                error=None
            )
        
        # HEALED case
        return HealingResponse(
            success=True,
            status=result["status"],
            healed_selector=result["selector"],
            explanation=f"Original selector '{data.original_selector}' was updated to '{result['selector']}'",
            error=None
        )

    except Exception as e:
        jira_url = create_jira_issue(
            "Element Healing",
            str(e),
            data
        )
        return HealingResponse(
            success=False,
            status="FAILED",
            error=str(e),
            jira_url=jira_url
        )

@app.get("/api/health")
async def health_check():
    try:
        # Test Ollama connection
        response = requests.get(f"{OLLAMA_BASE_URL}/api/version")
        return {
            "status": "healthy",
            "ollama_version": response.json().get("version", "unknown")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Health check failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
