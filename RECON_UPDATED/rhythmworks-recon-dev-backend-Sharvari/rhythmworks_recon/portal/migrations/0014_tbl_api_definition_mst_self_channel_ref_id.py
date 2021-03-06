# Generated by Django 3.1.2 on 2020-10-22 12:30

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('portal', '0013_remove_tbl_api_definition_mst_self_channel_ref_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='tbl_api_definition_mst',
            name='self_channel_ref_id',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='portal.tbl_channel_mst', verbose_name='Self Channel Ref Id'),
        ),
    ]
