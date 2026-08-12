"""Curated, evidence-based project records for the public portfolio."""

REQUIRED_FIELDS = {
    "source_key",
    "title",
    "description",
    "tech_stack",
    "category",
    "role",
    "skills_learned",
    "repo_link",
    "display_order",
}

VALID_CATEGORIES = {"Web App", "Mobile App", "AI/ML", "Game Development", "DSA"}
REPOSITORY_PREFIX = "https://github.com/tiloschankarki/"


PROJECT_CATALOG = (
    {
        "source_key": "github:scholargraph",
        "title": "ScholarGraph",
        "description": (
            "A decentralized academic knowledge graph that connects papers, authors, "
            "institutions, publishers, and datasets in Neo4j while anchoring research "
            "identifiers on Polygon for transparent verification."
        ),
        "tech_stack": "React, Node.js, Neo4j, Solidity, Polygon",
        "category": "Web App",
        "role": "Full-stack and blockchain developer",
        "skills_learned": (
            "Knowledge-graph modeling, blockchain integration, full-stack architecture, "
            "and research-data provenance"
        ),
        "repo_link": "https://github.com/tiloschankarki/ScholarGraph",
        "display_order": 10,
    },
    {
        "source_key": "github:systemsecurityproject",
        "title": "IoT Malware Detection",
        "description": (
            "An IoT intrusion-detection system trained on CTU-IoT-23 network traffic. "
            "It compares decision-tree and random-forest models with scenario-based "
            "evaluation to test whether detection generalizes to unseen attacks and devices."
        ),
        "tech_stack": "Python, pandas, scikit-learn, Streamlit, Plotly",
        "category": "AI/ML",
        "role": "Machine-learning and security engineer",
        "skills_learned": (
            "Network-security analysis, leakage-resistant evaluation, feature preprocessing, "
            "model tuning, and dashboard reporting"
        ),
        "repo_link": "https://github.com/tiloschankarki/SystemSecurityProject",
        "display_order": 20,
    },
    {
        "source_key": "github:pynance",
        "title": "Pynance",
        "description": (
            "A web-based personal finance system for recording income and expenses, "
            "visualizing cash-flow trends, tracking savings goals, and importing "
            "transaction data from CSV files."
        ),
        "tech_stack": "Python, Flask, SQLAlchemy, JavaScript, Plotly",
        "category": "Web App",
        "role": "Full-stack developer",
        "skills_learned": (
            "Financial-data modeling, relational persistence, interactive visualization, "
            "CSV ingestion, and full-stack application design"
        ),
        "repo_link": "https://github.com/tiloschankarki/Pynance",
        "display_order": 30,
    },
    {
        "source_key": "github:learning-amazon-sentiment",
        "title": "Amazon Review Sentiment Analysis",
        "description": (
            "A machine-learning study that classifies more than 100,000 Amazon appliance "
            "reviews using TF-IDF features and compares logistic regression, support-vector "
            "machine, and Naive Bayes classifiers."
        ),
        "tech_stack": "Python, Jupyter, pandas, TF-IDF, scikit-learn",
        "category": "AI/ML",
        "role": "Machine-learning developer",
        "skills_learned": (
            "Natural-language preprocessing, feature engineering, classifier comparison, "
            "and evaluation of large review datasets"
        ),
        "repo_link": "https://github.com/tiloschankarki/Learning-Amazon-Sentiment",
        "display_order": 40,
    },
    {
        "source_key": "github:resume-screener",
        "title": "Resume Screener",
        "description": (
            "A Python and Streamlit tool that parses resumes and job listings, extracts "
            "relevant information, and supports structured comparison during a job search."
        ),
        "tech_stack": "Python, Streamlit, PyMuPDF, Beautiful Soup, pandas",
        "category": "AI/ML",
        "role": "Application developer",
        "skills_learned": (
            "Document parsing, web-data extraction, structured comparison, and interactive "
            "data-application development"
        ),
        "repo_link": "https://github.com/tiloschankarki/Resume-Screener",
        "display_order": 50,
    },
    {
        "source_key": "github:searchenginepr",
        "title": "Search Engine Data Mining Project",
        "description": (
            "A Python data-mining project focused on building and evaluating search and "
            "information-retrieval techniques."
        ),
        "tech_stack": "Python, Data Mining, Information Retrieval",
        "category": "AI/ML",
        "role": "Data-mining developer",
        "skills_learned": (
            "Information retrieval, search-system design, data preprocessing, and result evaluation"
        ),
        "repo_link": None,
        "display_order": 60,
    },
    {
        "source_key": "github:smarthomesocketpr",
        "title": "Smart Home Socket Communication",
        "description": (
            "A Python socket-programming project implementing TCP and UDP client-server "
            "communication, with logging and a written technical report."
        ),
        "tech_stack": "Python, TCP, UDP, Socket Programming",
        "category": "Web App",
        "role": "Systems developer",
        "skills_learned": (
            "Network protocols, client-server architecture, socket programming, and event logging"
        ),
        "repo_link": "https://github.com/tiloschankarki/SmartHomeSocketPr",
        "display_order": 70,
    },
    {
        "source_key": "github:whats-the-move",
        "title": "What's the Move?",
        "description": (
            "A collaborative Flask travel-planning application with shared rooms, destination "
            "voting, itineraries, nearby points of interest, photo sharing, music, and an AI "
            "travel guide."
        ),
        "tech_stack": "Python, Flask, JavaScript, Firebase, Google Cloud Run, OpenAI API",
        "category": "Web App",
        "role": "Full-stack developer",
        "skills_learned": (
            "Collaborative workflows, cloud deployment, real-time data, API integration, "
            "and AI-assisted user experiences"
        ),
        "repo_link": None,
        "display_order": 80,
    },
)


def validate_project_catalog(catalog):
    """Raise ValueError when curated project data violates import invariants."""
    source_keys = set()
    display_orders = set()

    for index, project in enumerate(catalog):
        missing = REQUIRED_FIELDS - project.keys()
        if missing:
            raise ValueError(
                f"Missing required fields at index {index}: {', '.join(sorted(missing))}"
            )

        source_key = project["source_key"]
        if source_key in source_keys:
            raise ValueError(f"Duplicate source_key: {source_key}")
        source_keys.add(source_key)

        display_order = project["display_order"]
        if display_order in display_orders:
            raise ValueError(f"Duplicate display_order: {display_order}")
        display_orders.add(display_order)

        category = project["category"]
        if category not in VALID_CATEGORIES:
            raise ValueError(f"Invalid category: {category}")

        repo_link = project["repo_link"]
        if repo_link is not None and not repo_link.startswith(REPOSITORY_PREFIX):
            raise ValueError(f"Invalid repo_link: {repo_link}")
