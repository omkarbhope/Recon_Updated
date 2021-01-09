from .models import *
from rest_framework import serializers
from re import T
from django.contrib.auth.models import User
from rest_framework import fields
from pyexpat import model
from django.db.models import fields
from rest_framework.fields import SerializerMethodField

class LoginMasterSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = tbl_login_mst
        fields  = ('__all__')

    def get(user):
        return tbl_login_mst.objects.get(user = user)

class UserSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required = False)   #may be required

    class Meta:
        model = User
        fields = ('__all__')
        
    def get(username):
        return User.objects.get(username = username)

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tbl_Role_Mst
        fields = ('__all__')

    def get(role):
        return Tbl_Role_Mst.objects.get(id = role.id)

class TermSerializer(serializers.ModelSerializer):
    class Meta:

        model = tbl_term_mst
        fields = ('__all__')

class ChannelSerializer(serializers.ModelSerializer):
    class Meta:
        model = tbl_channel_mst
        fields = '__all__'

class CompanySerializer(serializers.ModelSerializer):
    companies = ChannelSerializer(many=True,read_only=True)
    class Meta:

        model = tbl_company_mst
        fields = ('__all__')

    def create(self, validated_data):
        return tbl_company_mst.objects.create(**validated_data)

class MasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = tbl_master
        fields = ('__all__')

class tbl_role_mst_serializer(serializers.ModelSerializer):
    class Meta:
        model = Tbl_Role_Mst
        fields = ('__all__')        

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = tbl_location_mst
        fields = ('__all__') 

class CitySerializer(serializers.ModelSerializer):
    locations = LocationSerializer(many=True, read_only=True)

    class Meta:
        model = Tbl_City_Mst
        fields = ('__all__')

class StateSerializer(serializers.ModelSerializer):
    cities = CitySerializer(many=True, read_only=True)
    class Meta:
        model = Tbl_State_Mst
        fields = ('__all__')

class CountrySerializer(serializers.ModelSerializer):
    states = StateSerializer(many=True, read_only=True)
    class Meta:
        model = Tbl_Country_Mst
        fields = ('__all__')

class UOMSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tbl_Uom_Mst
        fields = '__all__'

class CurrencySerializer(serializers.ModelSerializer):
    country_name = serializers.CharField(source='country_id.name',read_only=True)
    class Meta:
        model = Tbl_Currency_Mst
        fields = '__all__'

class tbl_reason_mst_serializers(serializers.ModelSerializer):
    class Meta:
        model = tbl_reason_mst
        fields = '__all__'

class tbl_transaction_type_mst_serializer(serializers.ModelSerializer):
   
    class Meta:
        model = tbl_transaction_type_mst
        fields = '__all__'

class tbl_sourcetable_fields_mst_serializers(serializers.ModelSerializer):
    class Meta:
        model = tbl_sourcetable_fields_mst
        fields = '__all__'        

class tbl_source_details_serializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required = False)
    
    class Meta:
        model = tbl_source_details
        fields = '__all__'

class EmployeeSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    class Meta:
        model = tbl_employee_mst
        fields = ('__all__')

class ActivitySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    class Meta:
        model = tbl_workflow_activity_mst
        fields = ('__all__')

class tbl_workflow_mst_serializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = tbl_workflow_mst
        fields = '__all__'        

class tbl_source_mst_serializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required = False)   #may be required

    company_name = serializers.CharField(source='company_ref_id.company_name',read_only=True)
    channel_name = serializers.CharField(source='channel_ref_id.name',read_only=True)
    network_type = serializers.CharField(source='network_type_ref_id.master_key',read_only=True)
    file_type = serializers.CharField(source='file_type_ref_id.master_key',read_only=True)

    initialItemRow = tbl_source_details_serializer(many=True)
    class Meta:
        model = tbl_source_mst
        fields=('__all__')
        
    def create(self, validated_data):
        initialItemRow = validated_data.pop('initialItemRow')
        source = tbl_source_mst.objects.create(**validated_data)
        for item in initialItemRow:
            tbl_source_details.objects.create(**item,header_ref_id=source)
        return source

    def update(self, instance, validated_data):
        object = tbl_source_mst.objects.get(id=validated_data['id'])
        initialItemRow = validated_data.pop('initialItemRow')
        
        instance.company_ref_id=validated_data.get('company_ref_id',instance.company_ref_id)
        instance.channel_ref_id=validated_data.get('channel_ref_id',instance.channel_ref_id)
        instance.source_name=validated_data.get('source_name',instance.source_name)
        instance.network_type_ref_id=validated_data.get('network_type_ref_id',instance.network_type_ref_id)
        instance.file_type_ref_id=validated_data.get('file_type_ref_id',instance.file_type_ref_id)
        instance.application_id=validated_data.get('application_id',instance.application_id)
        instance.sub_application_id=validated_data.get('sub_application_id',instance.sub_application_id)
        instance.from_date=validated_data.get('from_date',(instance.from_date).strftime('%Y-%m-%d'))
        instance.to_date=validated_data.get('to_date',(instance.to_date).strftime('%Y-%m-%d'))
        instance.revision_status=validated_data.get('revision_status',instance.revision_status)
        instance.version_number=validated_data.get('version_number',instance.version_number)
        instance.is_deleted=validated_data.get('is_deleted',instance.is_deleted)
        instance.updated_date_time=validated_data.get('updated_date_time',instance.updated_date_time)
        instance.save()

        keep_details = []
        print()
        for init in initialItemRow:
            if "id" in init.keys():
                if tbl_source_details.objects.filter(id=init['id']).exists():
                    det = tbl_source_details.objects.get(id=init['id'])
                    det.section_identifier_id = init.get('section_identifier_id',det.section_identifier_id)
                    det.field_data_type_ref_id = init.get('field_data_type_ref_id',det.field_data_type_ref_id)
                    det.field_name = init.get('field_name',det.field_name)
                    det.field_length = init.get('field_length',det.field_length)
                    det.is_key_field = init.get('is_key_field',det.is_key_field)
                    det.is_primary_field = init.get('is_primary_field',det.is_primary_field)
                    det.application_id = init.get('application_id',det.application_id)
                    det.sub_application_id = init.get('sub_application_id',det.sub_application_id)
                    det.save()
                    keep_details.append(det.id)
                else:
                    continue
            else:
                det = tbl_source_details.objects.create(**init,header_ref_id=instance)
                keep_details.append(det.id)
        print("KEys= ",keep_details)
    
        det=tbl_source_details.objects.filter(header_ref_id=object.id)
        det_id = [d.id for d in det]
        print("DET=>",det_id)

        for d in det_id:
            if d in keep_details:
                continue
            else:
                print(d)
                det_record=  tbl_source_details.objects.get(id=d)
                det_record.is_deleted='Y'
                det_record.save()
                
        return instance

# class tbl_source_mst_serializer(serializers.ModelSerializer):
#     id = serializers.ReadOnlyField()

#     class Meta:
#         model = tbl_source_mst
#         fields = '__all__'

# class tbl_source_details_serializer(serializers.ModelSerializer):
#     id = serializers.IntegerField(required = False)   #may be required
#     company_name = serializers.CharField(source='company_ref_id.company_name',read_only=True)
#     channel_name = serializers.CharField(source='channel_ref_id.name',read_only=True)
#     network_type = serializers.CharField(source='network_type_ref_id.master_key',read_only=True)
#     file_type = serializers.CharField(source='file_type_ref_id.master_key',read_only=True)
#     # net_object = Tbl_Master.objects.get(master_type="Type of Network",master_value="network_type_ref_id")
#     # net_type = serializers.CharField(source=net_object.master_type,read_only=True)
#     # print("NET ",net_object)
#     initialItemRow = SourceDetailsSerialzer(many=True)
#     class Meta:
#         model = tbl_source_mst
#         fields=('__all__')
        
#     def create(self, validated_data):
#         initialItemRow = validated_data.pop('initialItemRow')
#         source = tbl_source_mst.objects.create(**validated_data)
#         for item in initialItemRow:
#             tbl_source_details.objects.create(**item,header_ref_id=source)
#         return source

#     def update(self, instance, validated_data):
#         object = tbl_source_mst.objects.get(id=validated_data['id'])
#         initialItemRow = validated_data.pop('initialItemRow')
        
#         instance.company_ref_id=validated_data.get('company_ref_id',instance.company_ref_id)
#         instance.channel_ref_id=validated_data.get('channel_ref_id',instance.channel_ref_id)
#         instance.source_name=validated_data.get('source_name',instance.source_name)
#         instance.network_type_ref_id=validated_data.get('network_type_ref_id',instance.network_type_ref_id)
#         instance.file_type_ref_id=validated_data.get('file_type_ref_id',instance.file_type_ref_id)
#         instance.application_id=validated_data.get('application_id',instance.application_id)
#         instance.sub_application_id=validated_data.get('sub_application_id',instance.sub_application_id)
#         instance.from_date=validated_data.get('from_date',instance.from_date)
#         instance.to_date=validated_data.get('to_date',instance.to_date)
#         instance.revision_status=validated_data.get('revision_status',instance.revision_status)
#         instance.version_number=validated_data.get('version_number',instance.version_number)
#         instance.is_deleted=validated_data.get('is_deleted',instance.is_deleted)
#         instance.updated_date_time=validated_data.get('updated_date_time',instance.updated_date_time)
#         instance.save()

#         keep_details = []
#         print()
#         for init in initialItemRow:
#             if "id" in init.keys():
#                 if tbl_source_details.objects.filter(id=init['id']).exists():
#                     det = tbl_source_details.objects.get(id=init['id'])
#                     det.section_identifier_id = init.get('section_identifier_id',det.section_identifier_id)
#                     det.field_data_type_ref_id = init.get('field_data_type_ref_id',det.field_data_type_ref_id)
#                     det.field_name = init.get('field_name',det.field_name)
#                     det.field_length = init.get('field_length',det.field_length)
#                     det.is_key_field = init.get('is_key_field',det.is_key_field)
#                     det.is_primary_field = init.get('is_primary_field',det.is_primary_field)
#                     det.application_id = init.get('application_id',det.application_id)
#                     det.sub_application_id = init.get('sub_application_id',det.sub_application_id)
#                     det.save()
#                     keep_details.append(det.id)
#                 else:
#                     continue
#             else:
#                 det = tbl_source_details.objects.create(**init,header_ref_id=instance)
#                 keep_details.append(det.id)
#         print("KEys= ",keep_details)
    
#         det=tbl_source_details.objects.filter(header_ref_id=object.id)
#         det_id = [d.id for d in det]
#         print("DET=>",det_id)

#         for d in det_id:
#             if d in keep_details:
#                 continue
#             else:
#                 print(d)
#                 det_record=  tbl_source_details.objects.get(id=d)
#                 det_record.is_deleted='Y'
#                 det_record.save()
                
#         return instance


class tbl_reconcilation_definition_details_serializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    source_name_1_section_identifier_id = serializers.IntegerField(default=0, required=False)
    source_name_2_section_identifier_id = serializers.IntegerField(default=0, required=False)
    source_name_3_section_identifier_id = serializers.IntegerField(default=0, required=False)
    source_name_4_section_identifier_id = serializers.IntegerField(default=0, required=False)

    class Meta:
        model = tbl_reconcilation_definition_details
        fields = '__all__'

    def to_internal_value(self, data):
        source_name_section_identifier_id=['source_name_1_section_identifier_id',
                                            'source_name_2_section_identifier_id',
                                            'source_name_3_section_identifier_id',
                                            'source_name_4_section_identifier_id'];

        for item in source_name_section_identifier_id:
            if data.get(item) == '':
                data[item] = 0

        return super(tbl_reconcilation_definition_details_serializer, self).to_internal_value(data)

class tbl_reconcilation_definition_mst_serializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    company_name = serializers.CharField(source='company_ref_id.company_name', read_only=True)
    master_key = serializers.CharField(source='recon_type_ref_id.master_key', read_only=True)
    source_name_1 = serializers.CharField(source='source_name1_ref_id.source_name', read_only=True)
    source_name_2 = serializers.CharField(source='source_name2_ref_id.source_name', read_only=True)
    source_name_3 = serializers.CharField(source='source_name3_ref_id.source_name', read_only=True)
    source_name_4 = serializers.CharField(source='source_name4_ref_id.source_name', read_only=True)

    initialItemRow = tbl_reconcilation_definition_details_serializer(many=True)

    class Meta:
        model = tbl_reconcilation_definition_mst
        fields = '__all__'

    def create(self, validated_data):
        initialItemRow = validated_data.pop('initialItemRow')
        sourceMaster = tbl_reconcilation_definition_mst.objects.create(**validated_data)
        for item in initialItemRow:
            tbl_reconcilation_definition_details.objects.create(**item, header_ref_id=sourceMaster)
        return sourceMaster

    def update(self, instance, validated_data):
        object = tbl_reconcilation_definition_mst.objects.get(id=validated_data['id'])
        initialItemRow = validated_data.pop('initialItemRow')

        instance.company_ref_id = validated_data.get('company_ref_id', instance.company_ref_id)
        instance.name = validated_data.get('name', instance.name)
        instance.recon_type_ref_id = validated_data.get('recon_type_ref_id', instance.recon_type_ref_id)
        instance.source_name1_ref_id = validated_data.get('source_name1_ref_id', instance.source_name1_ref_id)
        instance.source_name2_ref_id = validated_data.get('source_name2_ref_id', instance.source_name2_ref_id)
        instance.source_name3_ref_id = validated_data.get('source_name3_ref_id', instance.source_name3_ref_id)
        instance.source_name4_ref_id = validated_data.get('source_name4_ref_id', instance.source_name4_ref_id)
        instance.recon_rule = validated_data.get('recon_rule', instance.recon_rule)
        instance.probable_match_rule = validated_data.get('probable_match_rule', instance.probable_match_rule)
        instance.application_id = validated_data.get('application_id', instance.application_id)
        instance.sub_application_id = validated_data.get('sub_application_id', instance.sub_application_id)
        instance.is_deleted = validated_data.get('is_deleted', instance.is_deleted)
        instance.created_date_time = validated_data.get('created_date_time', instance.created_date_time)
        instance.updated_date_time = validated_data.get('updated_date_time', instance.updated_date_time)
        instance.save()

        updated_data = []

        for init in initialItemRow:
            if "id" in init.keys():
                if tbl_reconcilation_definition_details.objects.filter(id=init['id']).exists():
                    det = tbl_reconcilation_definition_details.objects.get(id=init['id'])
                    det.source_name_1_ref_id = init.get('source_name_1_ref_id', det.source_name_1_ref_id)
                    det.source_name_1_field_name = init.get('source_name_1_field_name', det.source_name_1_field_name)
                    det.source_name_1_section_identifier_id = init.get('source_name_1_section_identifier_id', det.source_name_1_section_identifier_id)
                    det.source_name_2_ref_id = init.get('source_name_2_ref_id', det.source_name_2_ref_id)
                    det.source_name_2_field_name = init.get('source_name_2_field_name', det.source_name_2_field_name)
                    det.source_name_2_section_identifier_id = init.get('source_name_2_section_identifier_id', det.source_name_2_section_identifier_id)
                    det.source_name_3_ref_id = init.get('source_name_3_ref_id', det.source_name_3_ref_id)
                    det.source_name_3_field_name = init.get('source_name_3_field_name', det.source_name_3_field_name)
                    det.source_name_3_section_identifier_id = init.get('source_name_3_section_identifier_id', det.source_name_3_section_identifier_id)
                    det.source_name_4_ref_id = init.get('source_name_4_ref_id', det.source_name_4_ref_id)
                    det.source_name_4_field_name = init.get('source_name_4_field_name', det.source_name_4_field_name)
                    det.source_name_4_section_identifier_id = init.get('source_name_4_section_identifier_id', det.source_name_4_section_identifier_id)
                    det.created_date_time = init.get('created_date_time', det.created_date_time)
                    det.updated_date_time = init.get('updated_date_time', det.updated_date_time)
                    det.sub_application_id = init.get('sub_application_id', det.sub_application_id)
                    det.application_id = init.get('application_id', det.application_id)
                    det.save()
                    updated_data.append(det.id)
                else:
                    continue
            else:
                det = tbl_reconcilation_definition_details.objects.create(**init, header_ref_id=instance)
                updated_data.append(det.id)

        det = tbl_reconcilation_definition_details.objects.filter(header_ref_id=object.id)
        det_id = [d.id for d in det]

        for d in det_id:
            if d in updated_data:
                continue
            else:
                det_record = tbl_reconcilation_definition_details.objects.get(id=d)
                det_record.is_deleted = 'Y'
                det_record.save()
        return instance
class tbl_api_definition_details_serializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = tbl_api_definition_details
        fields = '__all__'


class tbl_api_definition_mst_serializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    company_name = serializers.CharField(source='company_ref_id.company_name', read_only=True)
    channel_name = serializers.CharField(source='channel_ref_id.name', read_only=True)
    self_channel_name = serializers.CharField(source='self_channel_ref_id.name', read_only=True)

    initialItemRow = tbl_api_definition_details_serializer(many=True)

    class Meta:
        model = tbl_api_definition_mst
        fields = '__all__'

    def create(self, validated_data):
        initialItemRow = validated_data.pop('initialItemRow')
        apiHub = tbl_api_definition_mst.objects.create(**validated_data)

        for item in initialItemRow:
            tbl_api_definition_details.objects.create(**item, header_ref_id=apiHub)
        return apiHub

    def update(self, instance, validated_data):
        object = tbl_api_definition_mst.objects.get(id=validated_data['id'])
        initialItemRow = validated_data.pop('initialItemRow')

        instance.name = validated_data.get('name', instance.name)
        instance.request_type_ref_id = validated_data.get('request_type_ref_id', instance.request_type_ref_id)
        instance.company_ref_id = validated_data.get('company_ref_id', instance.company_ref_id)
        instance.channel_ref_id = validated_data.get('channel_ref_id', instance.channel_ref_id)
        instance.self_channel_ref_id = validated_data.get('self_channel_ref_id', instance.self_channel_ref_id)
        instance.from_date = validated_data.get('from_date', instance.from_date)
        instance.to_date = validated_data.get('to_date', instance.to_date)
        instance.revision_status = validated_data.get('revision_status', instance.revision_status)
        instance.sub_application_id = validated_data.get('sub_application_id', instance.sub_application_id)
        instance.application_id = validated_data.get('application_id', instance.application_id)
        instance.is_deleted = validated_data.get('is_deleted', instance.is_deleted)
        instance.updated_date_time = validated_data.get('updated_date_time', instance.updated_date_time)
        instance.save()

        updated_data = []

        for init in initialItemRow:
            if "id" in init.keys():
                if tbl_api_definition_details.objects.filter(id=init['id']).exists():
                    det = tbl_api_definition_details.objects.get(id=init['id'])
                    det.api_field_name = init.get('api_field_name', det.api_field_name)
                    det.api_field_data_type_ref_id = init.get('api_field_data_type_ref_id', det.api_field_data_type_ref_id)
                    det.api_field_length = init.get('api_field_length', det.api_field_length)
                    det.table_name = init.get('table_name', det.table_name)
                    det.field_name = init.get('field_name', det.field_name)
                    det.field_data_type_ref_id = init.get('field_data_type_ref_id', det.field_data_type_ref_id)
                    det.field_length = init.get('field_length', det.field_length)
                    det.created_date_time = init.get('created_date_time', det.created_date_time)
                    det.is_deleted = init.get('is_deleted', det.is_deleted)
                    det.updated_date_time = init.get('updated_date_time', det.updated_date_time)
                    det.application_id = init.get('application_id', det.application_id)
                    det.sub_application_id = init.get('sub_application_id', det.sub_application_id)
                    det.save()
                    updated_data.append(det.id)
                else:
                    continue
            else:
                det = tbl_api_definition_details.objects.create(**init, header_ref_id=instance)
                updated_data.append(det.id)

        det = tbl_api_definition_details.objects.filter(header_ref_id=object.id)
        det_id = [d.id for d in det]

        for d in det_id:
            if d in updated_data:
                continue
            else:
                det_record = tbl_api_definition_details.objects.get(id=d)
                print(det_record)
                det_record.is_deleted = 'Y'
                print(det_record.is_deleted,'nnnnnnnnnnnnnn')
                det_record.save()
        return instance

# Standard API 

class tbl_api_definition_standard_details_serializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = tbl_api_definition_standard_details
        fields = '__all__'

class tbl_api_definition_standard_mst_serializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    company_name = serializers.CharField(source='company_ref_id.company_name', read_only=True)
    channel_name = serializers.CharField(source='channel_ref_id.name', read_only=True)
    initialItemRow = tbl_api_definition_standard_details_serializer(many=True)

    class Meta:
        model = tbl_api_definition_standard_mst
        fields = '__all__'

    def create(self, validated_data):
        initialItemRow = validated_data.pop('initialItemRow')
        standardApi = tbl_api_definition_standard_mst.objects.create(**validated_data)

        for item in initialItemRow:
            tbl_api_definition_standard_details.objects.create(**item, header_ref_id=standardApi)
        return standardApi
    
    def update(self, instance, validated_data):
        object = tbl_api_definition_standard_mst.objects.get(id=validated_data['id'])
        initialItemRow = validated_data.pop('initialItemRow')

        instance.company_ref_id = validated_data.get('company_ref_id', instance.company_ref_id)
        instance.channel_ref_id = validated_data.get('channel_ref_id', instance.channel_ref_id)
        instance.from_date = validated_data.get('from_date', instance.from_date)
        instance.to_date = validated_data.get('to_date', instance.to_date)
        instance.to_date = validated_data.get('to_date', instance.to_date)
        instance.is_deleted = validated_data.get('is_deleted', instance.is_deleted)
        instance.updated_date_time = validated_data.get('updated_date_time', instance.updated_date_time)

        instance.save()
        keep_details = []
        
        for init in initialItemRow:
            if "id" in init.keys():
                if tbl_api_definition_standard_details.objects.filter(id=init['id']).exists():
                    det = tbl_api_definition_standard_details.objects.get(id=init['id'])
                    det.request_type_ref_id = init.get('request_type_ref_id',det.request_type_ref_id)
                    det.api_type_ref_id = init.get('api_type_ref_id',det.api_type_ref_id)
                    det.protocol_type_ref_id = init.get('protocol_type_ref_id',det.protocol_type_ref_id)
                    det.file_format_type_ref_id = init.get('file_format_type_ref_id',det.file_format_type_ref_id)
                    det.authentication_type_ref_id = init.get('authentication_type_ref_id',det.authentication_type_ref_id)
                    det.communication_ref_id = init.get('communication_ref_id',det.communication_ref_id)
                    det.session_key_encryption_type_ref_id = init.get('session_key_encryption_type_ref_id',det.session_key_encryption_type_ref_id)
                    det.encryption_type_ref_id = init.get('encryption_type_ref_id',det.encryption_type_ref_id)
                    det.port = init.get('port',det.port)
                    det.verification_algorithm_ref_id = init.get('verification_algorithm_ref_id',det.verification_algorithm_ref_id)
                    det.end_point_url = init.get('end_point_url',det.end_point_url)
                    det.time_out = init.get('time_out',det.time_out)
                    det.created_date_time = init.get('created_date_time',det.created_date_time)
                    det.updated_date_time = init.get('updated_date_time',det.updated_date_time)
                    det.application_id = init.get('application_id',det.application_id)
                    det.sub_application_id = init.get('sub_application_id',det.sub_application_id)

                    det.save()
                    keep_details.append(det.id)
                else:
                    continue
            else:
                det = tbl_api_definition_standard_details.objects.create(**init,header_ref_id=instance)
                keep_details.append(det.id)
        
        det = tbl_api_definition_standard_details.objects.filter(header_ref_id=object.id)
        det_id = [d.id for d in det]

        for d in det_id:
            if d in keep_details:
                continue
            else:
                det_record = tbl_api_definition_standard_details.objects.get(id=d)
                det_record.is_deleted = 'Y'
                det_record.save()

        return instance 

# reconciliation process
class tbl_reconcilation_process_details_serializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = tbl_reconcilation_process_details
        fields = '__all__'

class tbl_reconcilation_process_mst_serializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    reconcilation_name = serializers.CharField(source='reconcilation_ref_id.name', read_only=True)
    initialItemRow = tbl_reconcilation_process_details_serializer(many=True)
    class Meta:
        model = tbl_reconcilation_process_mst
        fields = '__all__'

    def create(self, validated_data):
        initialItemRow = validated_data.pop('initialItemRow')
        reconProcess = tbl_reconcilation_process_mst.objects.create(**validated_data)
        
        for item in initialItemRow:
            tbl_reconcilation_process_details.objects.create(**item, header_ref_id=reconProcess)
        return reconProcess

    def update(self, instance, validated_data):
        object = tbl_reconcilation_process_mst.objects.get(id=validated_data['id'])
        initialItemRow = validated_data.pop('initialItemRow')

        instance.name = validated_data.get('name', instance.name)
        instance.reconcilation_ref_id = validated_data.get('reconcilation_ref_id', instance.reconcilation_ref_id)
        instance.is_deleted = validated_data.get('is_deleted', instance.is_deleted)
        instance.created_date_time = validated_data.get('created_date_time', instance.created_date_time)
        instance.updated_date_time = validated_data.get('updated_date_time', instance.updated_date_time)
        instance.sub_application_id = validated_data.get('sub_application_id', instance.sub_application_id)
        instance.application_id = validated_data.get('application_id', instance.application_id)

        instance.save()
        keep_details = []

        for init in initialItemRow:
            if "id" in init.keys():
                if tbl_reconcilation_process_details.objects.filter(id=init['id']).exists():
                    det = tbl_reconcilation_process_details.objects.get(id=init['id'])
                    det.operation_ref_id = init.get('operation_ref_id', det.operation_ref_id)
                    det.source_name_ref_id = init.get('source_name_ref_id', det.source_name_ref_id)
                    det.api_ref_id = init.get('api_ref_id', det.api_ref_id)
                    det.request_type_ref_id = init.get('request_type_ref_id', det.request_type_ref_id)
                    det.is_deleted = init.get('is_deleted', det.is_deleted)
                    det.created_date_time = init.get('created_date_time', det.created_date_time)
                    det.updated_date_time = init.get('updated_date_time', det.updated_date_time)
                    det.sub_application_id = init.get('sub_application_id', det.sub_application_id)
                    det.application_id = init.get('application_id', det.application_id)

                    det.save()
                    keep_details.append(det.id)
                else:
                    continue
            
            else:
                det = tbl_reconcilation_process_details.objects.create(**init, header_ref_id=instance)
                keep_details.append(det.id)
        
        det = tbl_reconcilation_process_details.objects.filter(header_ref_id=object.id)
        det_id = [d.id for d in det]

        for d in det_id:
            if d in keep_details:
                continue
            else:
                det_record = tbl_reconcilation_process_details.objects.get(id=d)
                det_record.is_deleted = 'Y'
                det_record.save()

        return instance

# Schedule Process
class tbl_schedule_process_mst_serializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    
    process_name = serializers.CharField(source='process_ref_id.name', read_only=True)
    frequency_type = serializers.CharField(source='frequency_ref_id.master_key', read_only=True)

    class Meta:
        model = tbl_schedule_process_mst
        fields = '__all__'

class LeftPanelSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    class Meta:
        model = tbl_left_panel
        fields = ('__all__')

class LevelDetailsSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    class Meta:
        model = tbl_workflow_level_data_details
        fields = ('__all__')

class LevelSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    initialItemRow = LevelDetailsSerializer(many=True)
    class Meta:
        model = tbl_workflow_level_data_mst
        fields = ('__all__')

    def create(self, validated_data):
        initialItemRow = validated_data.pop('initialItemRow')
        level = tbl_workflow_level_data_mst.objects.create(**validated_data)

        for item in initialItemRow:
            tbl_workflow_level_data_details.objects.create(**item, header_ref_id=level)
        return level

    def update(self, instance, validated_data):
        object = tbl_workflow_level_data_mst.objects.get(id=validated_data['id'])
        initialItemRow = validated_data.pop('initialItemRow')

        instance.level = validated_data.get('level', instance.level)
        instance.sub_application_id = validated_data.get('sub_application_id', instance.sub_application_id)
        instance.application_id = validated_data.get('application_id', instance.application_id)
        instance.is_deleted = validated_data.get('is_deleted', instance.is_deleted)
        instance.updated_date_time = validated_data.get('updated_date_time', instance.updated_date_time)
        instance.save()

        updated_data = []

        for init in initialItemRow:
            if "id" in init.keys():
                if tbl_workflow_level_data_details.objects.filter(id=init['id']).exists():
                    det = tbl_workflow_level_data_details.objects.get(id=init['id'])
                    activity_ref_id = init.get('activity_ref_id',det.activity_ref_id)
                    sequence_number = init.get('sequence_number',det.sequence_number)
                    action_ref_id = init.get('action_ref_id',det.action_ref_id)
                    next_sequence_number = init.get('next_sequence_number',det.next_sequence_number)
                    det.created_date_time = init.get('created_date_time', det.created_date_time)
                    det.is_deleted = init.get('is_deleted', det.is_deleted)
                    det.updated_date_time = init.get('updated_date_time', det.updated_date_time)
                    det.application_id = init.get('application_id', det.application_id)
                    det.sub_application_id = init.get('sub_application_id', det.sub_application_id)
                    det.save()
                    updated_data.append(det.id)
                else:
                    continue
            else:
                det = tbl_workflow_level_data_details.objects.create(**init, header_ref_id=instance)
                updated_data.append(det.id)

        det = tbl_workflow_level_data_details.objects.filter(header_ref_id=object.id)
        det_id = [d.id for d in det]

        for d in det_id:
            if d in updated_data:
                continue
            else:
                det_record = tbl_workflow_level_data_details.objects.get(id=d)
                print(det_record)
                det_record.is_deleted = 'Y'
                print(det_record.is_deleted,'nnnnnnnnnnnnnn')
                det_record.save()
        return instance

class ActionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    class Meta:
        model = tbl_workflow_action_mst
        fields = ('__all__')

class WorkflowSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    class Meta:
        model = tbl_workflow_mst
        fields = ('__all__')        

class GeneralSerializer(serializers.ModelSerializer):
    labels = serializers.SerializerMethodField()

    def _init_(self, *args, **kwargs):
        super(GeneralSerializer, self)._init_(*args, **kwargs)

        if 'labels' in self.fields:
            raise RuntimeError(
                'You cant have labels field defined '
                'while using GeneralSerializer'
            )

        self.fields['labels'] = SerializerMethodField()

    def get_labels(self, *args):
        labels = {}

        for field in self.Meta.model._meta.get_fields():
            if field.name in self.fields:
                labels[field.name] = field.verbose_name

        return labels

    class Meta:
        model = None
        exclude = ('is_active','is_deleted','created_date_time','created_by','updated_date_time','updated_by', 'sub_application_id','application_id' )        
