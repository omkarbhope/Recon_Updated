# Generated by Django 3.1.2 on 2020-12-21 13:57

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('portal', '0061_auto_20201211_1943'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='tbl_workflow_screen_linking_mst',
            name='company_ref_id',
        ),
        migrations.RemoveField(
            model_name='tbl_workflow_screen_linking_mst',
            name='entity_ref_id',
        ),
        migrations.RemoveField(
            model_name='tbl_workflow_screen_linking_mst',
            name='field_ref_id',
        ),
        migrations.RemoveField(
            model_name='tbl_workflow_screen_linking_mst',
            name='label_panel_ref_id',
        ),
        migrations.RemoveField(
            model_name='tbl_workflow_screen_linking_mst',
            name='level_ref_id',
        ),
        migrations.RemoveField(
            model_name='tbl_workflow_screen_linking_mst',
            name='workflow_type_ref_id',
        ),
        migrations.AddField(
            model_name='tbl_workflow_screen_linking_mst',
            name='database_field_name',
            field=models.CharField(default=0, max_length=100, verbose_name='Database Field Ref Name'),
        ),
        migrations.AddField(
            model_name='tbl_workflow_screen_linking_mst',
            name='label_field_name',
            field=models.CharField(default=0, max_length=100, verbose_name='Front End Field Name'),
        ),
        migrations.AlterField(
            model_name='tbl_workflow_details',
            name='field_name',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='portal.tbl_workflow_screen_linking_mst', verbose_name='field Name'),
        ),
        migrations.AlterField(
            model_name='tbl_workflow_details',
            name='screen_name',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, related_name='field', to='portal.tbl_workflow_screen_linking_mst', verbose_name='Screen'),
        ),
        migrations.CreateModel(
            name='tbl_entity_relationship_mst',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('share_id', models.IntegerField(default=0, verbose_name='Share ID')),
                ('entity_ref_id', models.TextField(default=0, verbose_name='Entity Ref ID')),
                ('is_active', models.CharField(default='Y', max_length=1, verbose_name='Is Active')),
                ('is_deleted', models.CharField(default='N', max_length=1, verbose_name='Is Deleted')),
                ('created_date_time', models.DateTimeField(default=django.utils.timezone.localtime, verbose_name='Created Date Time')),
                ('created_by', models.IntegerField(default=0, verbose_name='Created By')),
                ('updated_date_time', models.DateTimeField(default=django.utils.timezone.localtime, verbose_name='Updated Date Time')),
                ('updated_by', models.IntegerField(default=0, verbose_name='Updated By')),
                ('sub_application_id', models.CharField(max_length=20, verbose_name='Sub-Application ID')),
                ('application_id', models.CharField(max_length=20, verbose_name='Application ID')),
                ('company_ref_id', models.ForeignKey(default=0, on_delete=django.db.models.deletion.PROTECT, to='portal.tbl_company_mst', verbose_name='Company Ref Id')),
            ],
        ),
    ]
