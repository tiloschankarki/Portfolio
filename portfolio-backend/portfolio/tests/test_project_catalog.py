from copy import deepcopy

from django.test import SimpleTestCase

from portfolio.project_catalog import PROJECT_CATALOG, validate_project_catalog


class ProjectCatalogTests(SimpleTestCase):
    def test_catalog_has_expected_source_keys(self):
        self.assertEqual(
            {row["source_key"] for row in PROJECT_CATALOG},
            {
                "github:pynance",
                "github:systemsecurityproject",
                "github:smarthomesocketpr",
                "github:scholargraph",
                "github:whats-the-move",
                "github:learning-amazon-sentiment",
                "github:resume-screener",
                "github:searchenginepr",
            },
        )

    def test_excluded_repositories_are_absent(self):
        source_keys = {row["source_key"].lower() for row in PROJECT_CATALOG}

        for excluded in (
            "github:portfolio",
            "github:race-dataset",
            "github:python-project",
            "github:1st-project",
        ):
            self.assertNotIn(excluded, source_keys)

    def test_private_projects_have_no_repository_link(self):
        rows = {row["source_key"]: row for row in PROJECT_CATALOG}

        self.assertIsNone(rows["github:whats-the-move"]["repo_link"])
        self.assertIsNone(rows["github:searchenginepr"]["repo_link"])

    def test_catalog_validates(self):
        validate_project_catalog(PROJECT_CATALOG)

    def test_duplicate_source_key_is_rejected(self):
        catalog = list(deepcopy(PROJECT_CATALOG))
        catalog[1]["source_key"] = catalog[0]["source_key"]

        with self.assertRaisesRegex(ValueError, "Duplicate source_key"):
            validate_project_catalog(catalog)

    def test_duplicate_display_order_is_rejected(self):
        catalog = list(deepcopy(PROJECT_CATALOG))
        catalog[1]["display_order"] = catalog[0]["display_order"]

        with self.assertRaisesRegex(ValueError, "Duplicate display_order"):
            validate_project_catalog(catalog)

    def test_missing_required_field_is_rejected(self):
        catalog = list(deepcopy(PROJECT_CATALOG))
        del catalog[0]["description"]

        with self.assertRaisesRegex(ValueError, "Missing required fields"):
            validate_project_catalog(catalog)

    def test_invalid_category_is_rejected(self):
        catalog = list(deepcopy(PROJECT_CATALOG))
        catalog[0]["category"] = "Research"

        with self.assertRaisesRegex(ValueError, "Invalid category"):
            validate_project_catalog(catalog)

    def test_non_owner_github_url_is_rejected(self):
        catalog = list(deepcopy(PROJECT_CATALOG))
        catalog[0]["repo_link"] = "https://github.com/someone-else/project"

        with self.assertRaisesRegex(ValueError, "Invalid repo_link"):
            validate_project_catalog(catalog)
