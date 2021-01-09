# Generated by Django 3.1.2 on 2020-10-22 09:24

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('portal', '0010_auto_20201022_1348'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tbl_currency_mst',
            name='country_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='currency', to='portal.tbl_country_mst'),
        ),
        migrations.AddConstraint(
            model_name='tbl_currency_mst',
            constraint=models.UniqueConstraint(condition=models.Q(is_deleted='N'), fields=('country_id',), name='unique_if_not_deleted'),
        ),
        migrations.AddConstraint(
            model_name='tbl_currency_mst',
            constraint=models.UniqueConstraint(condition=models.Q(is_deleted='N'), fields=('currency_code',), name='unique_if_not'),
        ),
    ]