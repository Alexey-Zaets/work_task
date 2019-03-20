from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from faker import Faker
from blog.models import Tag, Category, Comment, Post


TEST_NAME = 'test'
TEST_EMAIL = 'test@email.com'
TEST_PASSWORD = 'testpassword'
ADMIN_NAME = 'admin'
ADMIN_EMAIL = 'admin@email.com'
ADMIN_PASSWORD = 'admin123456'

fake = Faker()

name = fake.first_name()
email = fake.email()
password = fake.password()
invalid_email = fake.text(max_nb_chars=10)


class CustomAPITestCase(APITestCase):

    def login_user_and_set_credentials(self, username, password):
        url = reverse('user_login')
        data = {'username': username, 'password': password}
        response = self.client.post(url, data)
        token = response.data['token']
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def login_admin_and_set_credentials(self):
        self.login_user_and_set_credentials(ADMIN_NAME, ADMIN_PASSWORD)


class AccountTest(CustomAPITestCase):

    @classmethod
    def setUpTestData(cls):
        User.objects.create_user(
            username=TEST_NAME,
            email=TEST_EMAIL,
            password=TEST_PASSWORD,
        )
        User.objects.create_user(
            username=ADMIN_NAME,
            email=ADMIN_EMAIL,
            password=ADMIN_PASSWORD,
            is_staff=True,
            is_superuser=True
        )

    def test_get_user_list(self):
        url = reverse('user_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_register_user(self):
        url = reverse('user_register')
        data = {
            'username': name,
            'email': email,
            'password': password,
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(
            User.objects.get(username=name).email, email
        )

    def test_register_user_with_an_existing_name(self):
        url = reverse('user_register')
        data = {
            'username': TEST_NAME,
            'email': fake.email(),
            'password': fake.password(),
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_user_with_an_existing_email(self):
        url = reverse('user_register')
        data = {
            'username': fake.name(),
            'email': TEST_EMAIL,
            'password': fake.password(),
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_user_with_invalid_email(self):
        url = reverse('user_register')
        data = {
            'username': fake.name(),
            'email': invalid_email,
            'password': password
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_registered_user(self):
        url = reverse('user_login')
        data = {'username': TEST_NAME, 'password': TEST_PASSWORD}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_login_user_with_invalid_password(self):
        url = reverse('user_login')
        data = {'username': TEST_NAME, 'password': fake.password()}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_user_with_invalid_username(self):
        url = reverse('user_login')
        data = {'username': fake.name(), 'password': TEST_PASSWORD}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_user(self):
        self.login_admin_and_set_credentials()
        user_to_delete = User.objects.get(username=TEST_NAME)
        response = self.client.delete(
            'http://0.0.0.0/api/v1/user/{}/'.format(user_to_delete.id)
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(User.objects.get(username=TEST_NAME).is_active)



class TagTest(CustomAPITestCase):

    @classmethod
    def setUpTestData(cls):
        Tag.objects.create(title='testtag')
        User.objects.create_user(
            username=ADMIN_NAME,
            email=ADMIN_EMAIL,
            password=ADMIN_PASSWORD,
            is_staff=True,
            is_superuser=True
        )

    def test_get_tag_list(self):
        url = reverse('tag_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_not_unique_tag(self):
        self.login_admin_and_set_credentials()
        url = reverse('tag_list')
        data = {'title': 'testtag'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_unique_tag(self):
        self.login_admin_and_set_credentials()
        url = reverse('tag_list')
        data = {'title': 'unique'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_update_existing_tag(self):
        self.login_admin_and_set_credentials()
        tag = Tag.objects.get(title='testtag')
        response = self.client.patch(
            'http://0.0.0.0/api/v1/tag/{}/'.format(tag.id),
            {'title': 'new_title'}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(Tag.objects.get(title='new_title'))

    def test_delete_existing_tag(self):
        self.login_admin_and_set_credentials()
        tag = Tag.objects.get(title='testtag')
        response = self.client.delete(
            'http://0.0.0.0/api/v1/tag/{}/'.format(tag.id)
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(
            self.client.get(
                'http://0.0.0.0/api/v1/tag/{}/'.format(tag.id)
            ).status_code,
            status.HTTP_404_NOT_FOUND,
        )


class CategoryTest(CustomAPITestCase):

    @classmethod
    def setUpTestData(cls):
        Category.objects.create(title='News')
        User.objects.create_user(
            username=ADMIN_NAME,
            email=ADMIN_EMAIL,
            password=ADMIN_PASSWORD,
            is_staff=True,
            is_superuser=True
        )

    def test_get_category_list(self):
        url = reverse('category_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_not_unique_category(self):
        self.login_admin_and_set_credentials()
        url = reverse('category_list')
        data = {'title': 'News'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_unique_category(self):
        self.login_admin_and_set_credentials()
        url = reverse('category_list')
        data = {'title': 'Python', 'parent': None}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_category_with_parent(self):
        self.login_admin_and_set_credentials()
        category = Category.objects.get(title='News')
        url = reverse('category_list')
        data = {'title': 'Python', 'parent': category.id}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Category.objects.get(title='Python'))
        self.assertTrue(
            Category.objects.get(title='Python').parent.title == 'News'
        )

    def test_update_category_title(self):
        self.login_admin_and_set_credentials()
        category = Category.objects.get(title='News')
        category_parent = category.parent
        response = self.client.patch(
            'http://0.0.0.0/api/v1/category/{}/'.format(category.id),
            {'title': 'New_title', 'parent': category_parent}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(Category.objects.get(title='New_title'))

    def test_delete_existing_category(self):
        self.login_admin_and_set_credentials()
        category = Category.objects.get(title='News')
        category_parent = category.parent
        response = self.client.delete(
            'http://0.0.0.0/api/v1/category/{}/'.format(category.id),
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(
            self.client.get(
                'http://0.0.0.0/api/v1/category/{}/'.format(category.id)
            ).status_code,
            status.HTTP_404_NOT_FOUND,
        )


class CommentTest(CustomAPITestCase):

    @classmethod
    def setUpTestData(cls):
        User.objects.create_user(
            username=ADMIN_NAME,
            email=ADMIN_EMAIL,
            password=ADMIN_PASSWORD,
            is_staff=True,
            is_superuser=True
        )
        Category.objects.create(title='News')
        Tag.objects.create(title='testtag')
        Comment.objects.create(
        )

    def test_get_comment_list(self):
        url = reverse('comment_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
