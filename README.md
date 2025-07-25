# Auto-Healing Test Framework

A smart test automation framework that automatically heals broken element locators in web applications. This project helps maintain robust test suites by automatically adapting to UI changes and providing intelligent selector healing capabilities.

## Features

- 🔄 Automatic selector healing
- 🎯 Multiple healing strategies
- 📊 Detailed healing explanations
- 🎨 Support for various UI scenarios
- 🔌 JIRA integration for issue tracking
- 🖥️ Handles complex DOM structures

## Project Structure

```
├── server.py                 # Main API server
├── test_healing.py          # Test cases for healing scenarios
├── test_server.py           # Server tests
├── auto-healing-tests/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── ai_healing/  # AI-based healing algorithms
│   │   │   └── jira/        # JIRA integration
│   │   └── requirements.txt
│   ├── config/
│   │   └── test_config.yaml # Test configuration
│   └── frontend/            # Dashboard UI
└── requirements.txt
```

## How It Works

1. **Element Detection**: The system monitors web elements during test execution
2. **Change Analysis**: When an element is not found, it analyzes:
   - Current HTML structure
   - Element attributes
   - Visibility state
   - DOM hierarchy
3. **Healing Strategy**: Applies various strategies to find the closest match:
   - ID-based healing
   - Class-based healing
   - Attribute-based healing
   - Structure-based healing
4. **Validation**: Verifies the healed selector
5. **Reporting**: Generates detailed reports and JIRA issues if needed

## Test Cases

The framework includes comprehensive test cases covering various scenarios:

1. Basic Selectors

   - No change needed
   - Dynamic IDs (React-style)
   - Hidden elements

2. Complex Scenarios

   - Shadow DOM elements
   - iFrame content
   - Responsive layouts
   - Overlays
   - Complex nested structures

3. Special Cases
   - Elements with special characters
   - ARIA attributes
   - Multiple classes
   - Disabled elements

## API Endpoints

### POST /api/heal-element

Heals a broken element selector.

**Request Body:**

```json
{
    "original_selector": "string",
    "html_content": "string",
    "element_attributes": {
        "key": "value"
    },
    "is_visible": boolean,
    "exists": boolean
}
```

**Response:**

```json
{
    "status": "string",
    "success": boolean,
    "healed_selector": "string",
    "explanation": "string",
    "error": "string",
    "jira_url": "string"
}
```

## Getting Started

1. Install dependencies:

```bash
pip install -r requirements.txt
```

2. Start the server:

```bash
python server.py
```

3. Run the test suite:

```bash
python test_healing.py
```

## Adding New Test Cases

To add new test cases, append to the `test_cases` list in `test_healing.py`:

```python
{
    "name": "Case Description",
    "data": {
        "original_selector": "selector",
        "html_content": "html",
        "element_attributes": {
            "attribute": "value"
        },
        "is_visible": bool,
        "exists": bool
    }
}
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Add test cases for your changes
4. Submit a pull request

## License

MIT License

## Contact

For questions and support, please open an issue in the repository.
