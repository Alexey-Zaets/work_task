# Generated by Django 2.1.7 on 2019-03-14 09:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0002_auto_20190313_1357'),
    ]

    operations = [
        migrations.AlterField(
            model_name='category',
            name='title',
            field=models.CharField(max_length=100, unique=True, verbose_name='Category title'),
        ),
    ]
