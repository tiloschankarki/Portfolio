from django.test import TestCase
from django.urls import reverse

from portfolio.models.project import Project


class ProjectOrderingTests(TestCase):
    def make_project(self, title, display_order):
        return Project.objects.create(
            title=title,
            description=f"{title} description",
            tech_stack="Python",
            category="AI/ML",
            role="Developer",
            source_key=f"test:{title.lower()}",
            display_order=display_order,
        )

    def test_projects_api_orders_by_display_order(self):
        self.make_project("Later", 20)
        self.make_project("First", 10)

        response = self.client.get(reverse("get_projects"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual([row["title"] for row in response.json()], ["First", "Later"])

    def test_homepage_uses_same_project_priority(self):
        for title, order in [
            ("Fourth", 40),
            ("Second", 20),
            ("First", 10),
            ("Third", 30),
        ]:
            self.make_project(title, order)

        response = self.client.get(reverse("get_homepage_summary"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            [row["title"] for row in response.json()["projects"]],
            ["First", "Second", "Third"],
        )
