# Generated by Django 3.1.2 on 2021-01-09 09:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('portal', '0064_tbl_back_panel'),
    ]

    operations = [
        migrations.AddField(
            model_name='tbl_left_panel',
            name='backend_model_name',
            field=models.CharField(default=0, max_length=500, verbose_name='Back End Model'),
        ),
    ]
