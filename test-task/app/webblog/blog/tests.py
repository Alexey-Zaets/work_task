from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from faker import Faker


fake = Faker()

class AccountTest(APITestCase):
    name = fake.first_name()
    email = fake.email()
    password = fake.password()
    invalid_email = fake.text(max_nb_chars=10)

    def test_register_user(self):
        url = reverse('user_register')
        data = {
            'username': self.name,
            'email': self.email,
            'password': self.password,
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(
            User.objects.get(username=self.name).email, self.email
        )

    # def test_register_user_with_an_existing_name(self):
    #     url = reverse('user_register')
    #     data = {
    #         'username': self.name,
    #         'email': fake.email(),
    #         'password': fake.password(),
    #     }
    #     response = self.client.post(url, data)
    #     self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_user_with_an_existing_email(self):
        url = reverse('user_register')
        data = {
            'username': fake.name(),
            'email': self.email,
            'password': fake.password(),
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_user_with_invalid_email(self):
        url = reverse('user_register')
        data = {
            'username': fake.name(),
            'email': self.invalid_email,
            'password': self.password
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # def test_login_registered_user(self):
    #     url = reverse('user_login')
    #     data = {'username': self.name, 'password': self.password}
    #     response = self.client.post(url, data)
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_login_user_with_invalid_password(self):
        url = reverse('user_login')
        data = {'username': self.name, 'password': fake.password()}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_user_with_invalid_username(self):
        url = reverse('user_login')
        data = {'username': fake.name(), 'password': self.password}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)