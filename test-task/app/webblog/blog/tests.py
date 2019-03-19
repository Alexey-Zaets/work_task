from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from faker import Faker


fake = Faker()

name = fake.first_name()
email = fake.email()
password = fake.password()
invalid_email = fake.text(max_nb_chars=10)

class AccountTest(APITestCase):

    @classmethod
    def setUpTestData(cls):
        User.objects.create_user(
            username='test',
            email='test@email.com',
            password='testpassword',
        )
        

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
            'username': 'test',
            'email': fake.email(),
            'password': fake.password(),
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_user_with_an_existing_email(self):
        url = reverse('user_register')
        data = {
            'username': fake.name(),
            'email': 'test@email.com',
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
        data = {'username': 'test', 'password': 'testpassword'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_login_user_with_invalid_password(self):
        url = reverse('user_login')
        data = {'username': 'test', 'password': fake.password()}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_user_with_invalid_username(self):
        url = reverse('user_login')
        data = {'username': fake.name(), 'password': 'testpassword'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)