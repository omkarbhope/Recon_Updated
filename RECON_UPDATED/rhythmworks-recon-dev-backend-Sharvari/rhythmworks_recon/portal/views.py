from django.shortcuts import render,get_object_or_404
from rest_framework import viewsets,status,generics,permissions
from .models import *
from .serializers import *
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.schemas import views
from rest_framework.response import Response
from url_filter.integrations.drf import DjangoFilterBackend
from rest_framework.views import APIView
from copy import error
import json
import itertools
import pandas as pd

from django.db.models.fields import BooleanField
from rest_framework.fields import empty
from sqlalchemy import create_engine,Column, Integer, Float, String, Boolean,Table,Date,PrimaryKeyConstraint
engine = create_engine('postgresql://rhythmfl_bankrecon_dev:Rhythmflows@2020@85.187.133.83:5432/rhythmfl_bankrecondev', echo=True)
# engine = create_engine('sqlite:///db.sqlite3', echo=True)
from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()
Base.metadata.bind = engine
Base.metadata.create_all(engine)

from django.db import connection, models
from django.db.models import query
from django.http import HttpResponse, request
from django.http.response import JsonResponse
from rest_framework.decorators import api_view
import django.apps
from django.apps import apps
from django.contrib import admin
from django.core.management import sql, color

from rest_framework.parsers import JSONParser,FileUploadParser, MultiPartParser, FormParser

def dictfetchall(cursor):
    "Return all rows from a cursor as a dict"
    columns = [col[0] for col in cursor.description]
    return [
        dict(zip(columns, row))
        for row in cursor.fetchall()
    ]

# Create your views here.
class TermViewSet(viewsets.ModelViewSet):
    serializer_class = TermSerializer
    queryset = tbl_term_mst.objects.filter(is_deleted='N')

class CompanyViewSet(viewsets.ModelViewSet):
    serializer_class = CompanySerializer
    queryset = tbl_company_mst.objects.filter(is_deleted='N')

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()

class tbl_login_mst_view(viewsets.ModelViewSet):
    serializer_class = LoginMasterSerializer
    queryset = tbl_login_mst.objects.all()    

class CountryViewSet(viewsets.ModelViewSet):
    queryset = Tbl_Country_Mst.objects.filter(is_deleted='N')
    serializer_class = CountrySerializer        
 
class StateViewSet(viewsets.ModelViewSet):
    serializer_class = StateSerializer
    queryset = Tbl_State_Mst.objects.filter(is_deleted='N')

class CityViewSet(viewsets.ModelViewSet):
    serializer_class = CitySerializer
    queryset = Tbl_City_Mst.objects.filter(is_deleted='N')

class LocationViewSet(viewsets.ModelViewSet):
    serializer_class = LocationSerializer
    queryset = tbl_location_mst.objects.all().filter(is_deleted='N')

    def delete(self):
        self.queryset = tbl_location_mst.objects.filter(self=self).update(is_deleted='Y')

class tbl_reason_mst_view(viewsets.ModelViewSet):
    serializer_class = tbl_reason_mst_serializers
    queryset = tbl_reason_mst.objects.all().filter(is_deleted='N')

    def delete(self):
        self.queryset = tbl_reason_mst.objects.filter(self=self).update(is_deleted='Y')

class tbl_transaction_type_mst_view(viewsets.ModelViewSet):
    serializer_class = tbl_transaction_type_mst_serializer
    queryset = tbl_transaction_type_mst.objects.filter(is_deleted='N')

class tbl_sourcetable_fields_mst_view(viewsets.ModelViewSet):
    serializer_class = tbl_sourcetable_fields_mst_serializers
    queryset = tbl_sourcetable_fields_mst.objects.filter(is_deleted='N')

class UOMViewSet(viewsets.ModelViewSet):
    queryset = Tbl_Uom_Mst.objects.filter(is_deleted='N')
    serializer_class = UOMSerializer

    def delete(self):
        self.queryset = Tbl_Uom_Mst.objects.filter(self=self).update(is_deleted='Y')

class MasterViewSet(viewsets.ModelViewSet):
    serializer_class = MasterSerializer
    queryset = tbl_master.objects.filter(is_deleted='N')

    def list(self, request, master_type=None):
        if master_type:
            master = tbl_master.objects.filter(master_type = master_type, is_deleted='N')
            serializer = self.get_serializer(master, many=True)
            return Response(serializer.data)
        else:
            currency = tbl_master.objects.filter(is_deleted='N')
            serializer = self.get_serializer(currency, many=True)
            return Response(serializer.data)

class CurrencyViewSet(viewsets.ModelViewSet):
    queryset = Tbl_Currency_Mst.objects.filter(is_deleted='N')
    serializer_class = CurrencySerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['currency_code','is_deleted']

    def list(self, request, country_id=None):
        if country_id:
            currency = Tbl_Currency_Mst.objects.filter(country_id = country_id, is_deleted='N')
            serializer = self.get_serializer(currency, many=True)
            return Response(serializer.data)
        else:
            currency = Tbl_Currency_Mst.objects.filter(is_deleted='N')
            serializer = self.get_serializer(currency, many=True)
            return Response(serializer.data)

class ChannelViewset(viewsets.ModelViewSet):
    queryset = tbl_channel_mst.objects.all()
    serializer_class = ChannelSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['company_id']

# class CurrencyViewSet(generics.ListAPIView):
#     queryset = Tbl_Currency_Mst.objects.filter(is_deleted='N')
#     serializer_class = CurrencySerializer
#     filter_backends = [DjangoFilterBackend]
#     filter_fields = ['currency_code','is_deleted']

#     def get_queryset(self):
#         country_id = self.kwargs['country_id']
#         return Tbl_Currency_Mst.objects.filter(is_deleted='N', country_id=country_id)         

class EmployeeViewSet(viewsets.ModelViewSet):
    serializer_class = EmployeeSerializer
    queryset = tbl_employee_mst.objects.filter(is_deleted='N')

class ActivityViewSet(viewsets.ModelViewSet):
    serializer_class = ActivitySerializer
    queryset = tbl_workflow_activity_mst.objects.filter(is_deleted='N')

class LeftPanelViewSet(viewsets.ModelViewSet):
    serializer_class = LeftPanelSerializer
    queryset = tbl_left_panel.objects.filter(is_deleted='N')

class RoleViewSet(viewsets.ModelViewSet):
    serializer_class = RoleSerializer
    queryset = Tbl_Role_Mst.objects.filter(is_deleted='N')

class LevelViewSet(viewsets.ModelViewSet):
    serializer_class = LevelSerializer
    queryset = tbl_workflow_level_data_mst.objects.filter(is_deleted='N')

class LevelDetailsViewSet(viewsets.ModelViewSet):
    serializer_class = LevelDetailsSerializer
    queryset = tbl_workflow_level_data_details.objects.filter(is_deleted='N')

class ActionViewSet(viewsets.ModelViewSet):
    serializer_class = ActionSerializer
    queryset = tbl_workflow_action_mst.objects.filter(is_deleted='N')

class WorkflowViewSet(viewsets.ModelViewSet):
    serializer_class = WorkflowSerializer
    queryset = tbl_workflow_mst.objects.filter(is_deleted='N')


class tbl_source_mst_view(viewsets.ModelViewSet):
    queryset = tbl_source_mst.objects.filter(is_deleted='N')
    serializer_class = tbl_source_mst_serializer

class tbl_source_details_view(viewsets.ModelViewSet):
    queryset = tbl_source_details.objects.filter(is_deleted='N')
    serializer_class = tbl_source_details_serializer

    def retrieve(self, request, *args, **kwargs):
        header_ref_id = self.kwargs['pk']
        source_details = tbl_source_details.objects.filter(
            header_ref_id=header_ref_id, is_deleted='N')
        ser = tbl_source_details_serializer(source_details, many=True).data
        return Response(ser, status=status.HTTP_200_OK)

@csrf_exempt
def dynamic_table1(request):
    if request.method == "POST":
        tables = json.loads(request.body)
        # create table tbl_visa_src(id var,name varchar(20))
        for data in tables:
            query = "create table "
            count = 0
            select = "Select * from "
            for d in data:
                # name of table
                if 'name' in d:
                    print(d['name']);
                
                    query += d['name']+"("
                    select += d['name']
                else:
                    schema = d['schema']
                    for s in schema:
                        if count != 0:
                            query += ","+s['field']+" "+s['type']
                            if s['primary_key'] == "Yes":
                                query += " PRIMARY KEY"
                        else:
                            query += s['field']+" "+s['type']
                            if s['primary_key'] == "Yes":
                                query += " PRIMARY KEY"
                        count += 1
            query += ');'
            cursor = connection.cursor()
            cursor.execute(query)
            print("Query=>", query)
            cursor.execute(select)
            row = cursor.fetchone()
            print("Data=>", row)

        return JsonResponse({"Success": True})
    elif request.method == "GET":
        print("BYE")
        return JsonResponse({"Success": True})


# ORM dynamic Table
def create_model(name, fields=None, app_label='', module='', options=None, admin_opts=None):
    """
    Create specified model
    """
    class Meta:
        # Using type('Meta', ...) gives a dictproxy error during model creation
        pass

    if app_label:
        # app_label must be set using the Meta inner class
        setattr(Meta, 'app_label', app_label)

    # Update Meta with any options that were provided
    if options is not None:
        for key, value in options.items():
            setattr(Meta, key, value)

    # Set up a dictionary to simulate declarations within a class
    attrs = {'__module__': module, 'Meta': Meta}

    # Add in any fields that were provided
    if fields:
        attrs.update(fields)

    # Create the class, which automatically triggers ModelBase processing
    model = type(name, (models.Model,), attrs)

    # Create an Admin class if admin options were provided
    if admin_opts is  None:
        class Admin(admin.ModelAdmin):
            pass
        # for key, value in admin_opts:
        #     setattr(Admin, key, value)
        admin.site.register(model, Admin)

    return model


def dynamic_table12(request):
    fields = {
        'first_name': models.CharField(max_length=255),
        'last_name': models.CharField(max_length=255),
    }
    options = {
        'ordering': ['last_name', 'first_name'],
        'verbose_name': 'valued customer',
    }
    admin_opts = {}
    model = create_model('Student', fields,
                         options=options, admin_opts=admin_opts,
                         app_label='portal',
                         module='portal.models',
                         )
    style = color.no_style()
    statements, pending = sql.sql_model_create(model, style)
    cursor = connection.cursor()

    # for s in statements:
    #     cursor.execute(s)
    
    # with connection.schema_editor() as editor:
    #     editor.create_model(model)
    print("MODEL ", model)
    print("TBL ->", tbl_source_mst.__module__)
    print("TBL MODULE ->", tbl_source_details._meta.app_label)
    print("MODEL MODULE-> ", model.__module__)
    print("APP Label - >", model._meta.app_label)
    print("Length->", len(model._meta.fields))
    print("VERBOSE->", model._meta.verbose_name_plural)
    mylist = (django.apps.apps.get_models())
    for m in mylist:
        print(m)
    return HttpResponse("OK APP created")

# Function to create the dynamic table
def sql_format(data):
    print("Data = > ",data)
    class User(Base):
        __tablename__ = data['table_name']
        Flag=False

        schema = data['schema']

        for s in schema:
            if s['field_data_type']=='1':
                print("1")
                if s['is_primary_key']:
                    Flag=True
                    vars()[s['field_name']] = Column(Integer(),primary_key=True)
                else:
                        vars()[s['field_name']] = Column(Integer())
            elif s['field_data_type']=='2':
                print("1")
                if s['is_primary_key']:
                    Flag=True
                    vars()[s['field_name']] = Column(String(int(s['field_length'])),primary_key=True)
                else:
                        vars()[s['field_name']] = Column(String(int(s['field_length'])))
            elif s['field_data_type']=='3':
                vars()[s['field_name']] = Column(Boolean)
            elif s['field_data_type']=='4':
                if s['is_primary_key']:
                    Flag=True
                    # vars()[s['field_name']] = Column(Float(precision=4),primary_key=True)
                    vars()[s['field_name']] = Column(DECIMAL(s['field_length']),primary_key=True)
                else:
                        vars()[s['field_name']] = Column(DECIMAL(s['field_length']))
                      
            elif s['field_data_type']=='5':
                    vars()[s['field_name']] = Column(Date)

        if not Flag:
            id = Column(Integer, primary_key=True)
    Base.metadata.create_all(engine)

@csrf_exempt
def dynamic_table(request):
    if request.method == "POST":
        # Convert the data into json
        tables = json.loads(request.body)
        for data in tables:
            schema=data['schema']
            for s in schema:
                # Get the object of field_data_type from tbl_master and assign its master_value
                mst_object = tbl_master.objects.get(id=s['field_data_type'])
                s['field_data_type']=mst_object.master_value
                # print("TYPES = > ",s['field_data_type'])
            
            # Check whether data is empty or not
            if data:
                print("Data = > >",json.dumps(data, indent = 4) )
                sql_format(data)
            
        print("Tables=>",tables)
        return JsonResponse({"Success":True})

class tbl_reconcilation_definition_mst_view(viewsets.ModelViewSet):
    serializer_class = tbl_reconcilation_definition_mst_serializer
    queryset = tbl_reconcilation_definition_mst.objects.filter(is_deleted='N')

class tbl_reconcilation_definition_details_view(viewsets.ModelViewSet):
    serializer_class = tbl_reconcilation_definition_details_serializer
    queryset = tbl_reconcilation_definition_details.objects.filter(is_deleted='N')

class tbl_api_definition_details_view(viewsets.ModelViewSet):
    serializer_class = tbl_api_definition_details_serializer
    queryset = tbl_api_definition_details.objects.filter(is_deleted='N')

class tbl_api_definition_mst_view(viewsets.ModelViewSet):
    serializer_class = tbl_api_definition_mst_serializer
    queryset = tbl_api_definition_mst.objects.filter(is_deleted='N')

class tbl_api_definition_standard_details_view(viewsets.ModelViewSet):
    serializer_class = tbl_api_definition_standard_details_serializer
    queryset = tbl_api_definition_standard_details.objects.filter(is_deleted='N')

class tbl_api_definition_standard_mst_view(viewsets.ModelViewSet):
    serializer_class = tbl_api_definition_standard_mst_serializer
    queryset = tbl_api_definition_standard_mst.objects.filter(is_deleted='N')    

# reconciliation process
class tbl_reconcilation_process_details_view(viewsets.ModelViewSet):
    serializer_class = tbl_reconcilation_process_details_serializer
    queryset = tbl_reconcilation_process_details.objects.filter(is_deleted='N')

@csrf_exempt
def run_reconciliation(request):
    if request.method == "POST":
        # Convert the data into json
        data = json.loads(request.body)
        print(data)
        recon_id=int(data[0]['reconcilation_ref_id'])
        con = engine.connect()
        #Load Data ends
        recon_type = con.execute("""select master_key from portal_tbl_master where id in
                                    (SELECT recon_type_ref_id_id FROM public.portal_tbl_reconcilation_definition_mst
                                    where id=""" + str(recon_id) + """ and is_deleted= 'N')
                                    and is_deleted= 'N'
                                    """)
        source_details = con.execute("""SELECT source_name1_ref_id_id, source_name2_ref_id_id, source_name3_ref_id_id,
                                    source_name4_ref_id_id, recon_rule, probable_match_rule, is_deleted, recon_type_ref_id_id
                                    FROM public.portal_tbl_reconcilation_definition_mst
                                    where id = """ + str(recon_id)
                                    )
        recon_type = list(recon_type)
        source_details = list(source_details)

        print(source_details, recon_type)
        
        ################################################### TWO WAY ####################################################################

        if source_details[0][0] and source_details[0][1] and not source_details[0][2] and not source_details[0][3] and recon_type[0][0] == 'Two-way':
            source_names = []*2
            for i in range(2):
                source_name_query = con.execute("""SELECT source_name FROM public.portal_tbl_source_mst where id = """ + str(source_details[0][i]) + """;""")
                source_name_query = list(source_name_query)
                source_names.append(source_name_query[0][0])

            source1_name = 'tbl_' + source_names[0] + '_details'
            source2_name = 'tbl_' + source_names[1] + '_details'

            source1_dispute_name = 'tbl_' + source_names[0] + '_dispute_details'
            source2_dispute_name = 'tbl_' + source_names[1] + '_dispute_details'

            source_list = [source1_name, source2_name]
            print("Her is print statement")
            print(len(source_list))
            source_dispute_list = [source1_dispute_name, source2_dispute_name]

            recon_rule = source_details[0][4]
            probable_match_rule = source_details[0][5]

        ###################################################### RECON RULE QUERYING ###############################################

            update_query = """UPDATE {} SET "overall_recon_status"='Reconciled' FROM {} WHERE {};""".format(
                source1_name,
                source2_name,
                recon_rule
            )
            con.execute(update_query)
            print(update_query)
            
            update_query = """UPDATE {} SET "overall_recon_status"='Reconciled' FROM {} WHERE {};""".format(
                source2_name,
                source1_name,
                recon_rule
            )
            con.execute(update_query)
            print(update_query)

            recon_rule = [element.rstrip().replace('\n','').replace('\t','') for element in recon_rule.split('AND')]

            for i in range(len(source_list)):
                source_no = 1
                for j in range(len(source_list)):
                    if i != j:
                        # print(i+1, j+1, source_no, '\n')
                        actual_table = source_list[i]
                        specific_recon = source_list[j]

                        specific_rule = ""
                        for k in recon_rule:
                            if actual_table in k and specific_recon in k:
                                specific_rule += k + ' AND'

                        import re
                        update_query = """UPDATE {} SET "{}"='Reconciled' FROM {} WHERE {};""".format(
                                actual_table,
                                "recon_status_" + str(source_no),
                                specific_recon,
                                specific_rule[:-4]
                            )
                        source_no += 1


                        if update_query[-2] == ';':
                            update_query = update_query[:-1]
                        # print(update_query, '\n')
                        con.execute(update_query)

            ###################################################### PROBABLE MATCH RULE QUERYING ###############################################

            update_query = """UPDATE {} SET "overall_probable_status"='Reconciled' FROM {} WHERE {};""".format(
                source1_name,
                source2_name,
                probable_match_rule
            )
            con.execute(update_query)

            update_query = """UPDATE {} SET "overall_probable_status"='Reconciled' FROM {} WHERE {};""".format(
                source2_name,
                source1_name,
                probable_match_rule
            )
            con.execute(update_query)

            probable_match_rule = [element.rstrip().replace('\n','').replace('\t','') for element in probable_match_rule.split('AND')]

            for i in range(len(source_list)):
                source_no = 1
                for j in range(len(source_list)):
                    if i != j:
                        actual_table = source_list[i]
                        specific_probable = source_list[j]

                        specific_rule = ""
                        for k in probable_match_rule:
                            if actual_table in k and specific_probable in k:
                                specific_rule += k + ' AND'

                        import re
                        update_query = """UPDATE {} SET "{}"='Reconciled' FROM {} WHERE {};""".format(
                                actual_table,
                                "probable_recon_status_" + str(source_no),
                                specific_probable,
                                specific_rule[:-4]
                            )
                        # print(i+1, j+1, source_no, '\n')
                        source_no += 1


                        if update_query[-2] == ';':
                            update_query = update_query[:-1]
                        # print(update_query, '\n')
                        con.execute(update_query)

                        # update_query = """alter table {} rename recon_status_{} to recon_status_{}_to_{};""".format(
                        #                 source_list[i],
                        #                 source_no-1,
                        #                 str(i+1),
                        #                 str(j+1)
                        # )
                        # # print(update_query)
                        # con.execute(update_query)

                        # update_query = """alter table {} rename recon_status_{} to recon_status_{}_to_{};""".format(
                        #                 source_dispute_list[i],
                        #                 source_no-1,
                        #                 str(i+1),
                        #                 str(j+1)
                        # )
                        # # print(update_query)
                        # con.execute(update_query)

                        # update_query = """alter table {} rename probable_recon_status_{} to probable_recon_status_{}_to_{};""".format(
                        #                 source_list[i],
                        #                 source_no-1,
                        #                 str(i+1),
                        #                 str(j+1)
                        # )
                        # # print(update_query)
                        # con.execute(update_query)

                        # update_query = """alter table {} rename probable_recon_status_{} to probable_recon_status_{}_to_{};""".format(
                        #                 source_dispute_list[i],
                        #                 source_no-1,
                        #                 str(i+1),
                        #                 str(j+1)
                        # )
                        # # print(update_query)
                        # con.execute(update_query)
            
            for i in range(len(source_list)):
                source_no = 1
                for j in range(len(source_list)):
                    if i != j:
                        source_no += 1
                        update_query = """alter table {} rename recon_status_{} to recon_status_{}_to_{};""".format(
                                        source_list[i],
                                        source_no-1,
                                        str(i+1),
                                        str(j+1)
                        )
                        # print(update_query)
                        con.execute(update_query)

                        update_query = """alter table {} rename recon_status_{} to recon_status_{}_to_{};""".format(
                                        source_dispute_list[i],
                                        source_no-1,
                                        str(i+1),
                                        str(j+1)
                        )
                        # print(update_query)
                        con.execute(update_query)

                        update_query = """alter table {} rename probable_recon_status_{} to probable_recon_status_{}_to_{};""".format(
                                        source_list[i],
                                        source_no-1,
                                        str(i+1),
                                        str(j+1)
                        )
                        # print(update_query)
                        con.execute(update_query)

                        update_query = """alter table {} rename probable_recon_status_{} to probable_recon_status_{}_to_{};""".format(
                                        source_dispute_list[i],
                                        source_no-1,
                                        str(i+1),
                                        str(j+1)
                        )
                        # print(update_query)
                        con.execute(update_query)
                        
            ######################################### DISPUTE 2 WAY #########################################################

            from sqlalchemy.orm import sessionmaker
            Session = sessionmaker(bind=engine)
            Session.configure(bind=engine) 
            session = Session()
            print("DISPUTE 2 WAY")     
            for i in range(len(source_list)):

                class Tbl_details(Base):
                    __table__ = Table(source_list[i], Base.metadata,
                                    autoload=True)

                class Tbl_dispute_details(Base):
                    __table__ = Table(source_dispute_list[i], Base.metadata,
                                    autoload=True)

                tbl_details = Tbl_details()

                rows = session.query(Tbl_details).order_by(Tbl_details.details_id).all()

                auto_inc = 1
                for each_row in rows:
                    tbl_details_dict = each_row.__dict__
                    for key in tbl_details_dict.copy():
                        if key == '_sa_instance_state':
                            del tbl_details_dict[key]
                    tbl_details_dict['action'] = 'Not Initiated'
                    if tbl_details_dict['overall_recon_status'] == 'Not Reconciled':
                        for key in tbl_details_dict.copy():
                            if key == 'details_id':
                                details_ref_id = tbl_details_dict['details_id']
                                tbl_details_dict['details_ref_id'] = details_ref_id
                                tbl_details_dict['dispute_id'] = auto_inc
                                auto_inc += 1
                                del tbl_details_dict[key]
                        tbl_dispute_details = Tbl_dispute_details()
                        tbl_dispute_details.__dict__.update(tbl_details_dict)
                        session.add(tbl_dispute_details)
                session.commit()

        ################################################### THREE WAY ####################################################################

        if source_details[0][0] and source_details[0][1] and source_details[0][2] and not source_details[0][3] and recon_type[0][0] == 'Three-way':
            source_names = []*3
            for i in range(3):
                source_name_query = con.execute("""SELECT source_name FROM public.portal_tbl_source_mst where id = """ + str(source_details[0][i]) + """;""")
                source_name_query = list(source_name_query)
                source_names.append(source_name_query[0][0])

            source1_name = 'tbl_' + source_names[0] + '_details'
            source2_name = 'tbl_' + source_names[1] + '_details'
            source3_name = 'tbl_' + source_names[2] + '_details'

            source1_dispute_name = 'tbl_' + source_names[0] + '_dispute_details'
            source2_dispute_name = 'tbl_' + source_names[1] + '_dispute_details'
            source3_dispute_name = 'tbl_' + source_names[2] + '_dispute_details'

            source_list = [source1_name, source2_name, source3_name]
            source_dispute_list = [source1_dispute_name, source2_dispute_name, source3_dispute_name]

            recon_rule = source_details[0][4]
            probable_match_rule = source_details[0][5]

        ###################################################### RECON RULE QUERYING ###############################################

            update_query = """UPDATE {} SET "overall_recon_status"='Reconciled' FROM {}, {} WHERE {};""".format(
                source1_name,
                source2_name,
                source3_name,
                recon_rule
            )
            con.execute(update_query)

            update_query = """UPDATE {} SET "overall_recon_status"='Reconciled' FROM {}, {} WHERE {};""".format(
                source2_name,
                source1_name,
                source3_name,
                recon_rule
            )
            con.execute(update_query)

            update_query = """UPDATE {} SET "overall_recon_status"='Reconciled' FROM {}, {} WHERE {};""".format(
                source3_name,
                source1_name,
                source2_name,
                recon_rule
            )
            con.execute(update_query)

            ###################################################### PROBABLE MATCH RULE QUERYING ###############################################

            update_query = """UPDATE {} SET "overall_probable_status"='Reconciled' FROM {}, {} WHERE {};""".format(
                source1_name,
                source2_name,
                source3_name,
                probable_match_rule
            )
            con.execute(update_query)

            update_query = """UPDATE {} SET "overall_probable_status"='Reconciled' FROM {}, {} WHERE {};""".format(
                source2_name,
                source1_name,
                source3_name,
                probable_match_rule
            )
            con.execute(update_query)

            update_query = """UPDATE {} SET "overall_probable_status"='Reconciled' FROM {}, {} WHERE {};""".format(
                source3_name,
                source1_name,
                source2_name,
                probable_match_rule
            )
            con.execute(update_query)

            ################################# DISPUTE 3 WAY #########################################################

            from sqlalchemy.orm import sessionmaker
            Session = sessionmaker(bind=engine)
            Session.configure(bind=engine) 
            session = Session()

            for i in range(len(source_list)):

                class Tbl_details(Base):
                    __table__ = Table(source_list[i], Base.metadata,
                                    autoload=True, autoload_with=engine)

                class Tbl_dispute_details(Base):
                    __table__ = Table(source_dispute_list[i], Base.metadata,
                                    autoload=True, autoload_with=engine)

                tbl_details = Tbl_details()

                rows = session.query(Tbl_details).all()

                for each_row in rows:
                    tbl_details_dict = each_row.__dict__
                    for key in tbl_details_dict.copy():
                        if key == '_sa_instance_state':
                            del tbl_details_dict[key]
                    tbl_details_dict['action'] = 'Not Initiated'
                    if tbl_details_dict['overall_recon_status'] == 'Not Reconciled':
                        tbl_dispute_details = Tbl_dispute_details()
                        tbl_dispute_details.__dict__.update(tbl_details_dict)
                        session.add(tbl_dispute_details)

                session.commit()

        ############################################### FOUR WAY ####################################################################

        if source_details[0][0] and source_details[0][1] and source_details[0][2] and source_details[0][3] and recon_type[0][0] == 'Four-way':
            source_names = []*4
            for i in range(4):
                source_name_query = con.execute("""SELECT source_name FROM public.portal_tbl_source_mst where id = """ + str(source_details[0][i]) + """;""")
                source_name_query = list(source_name_query)
                source_names.append(source_name_query[0][0])

            source1_name = 'tbl_' + source_names[0] + '_details'
            source2_name = 'tbl_' + source_names[1] + '_details'
            source3_name = 'tbl_' + source_names[2] + '_details'
            source4_name = 'tbl_' + source_names[3] + '_details'

            source1_dispute_name = 'tbl_' + source_names[0] + '_dispute_details'
            source2_dispute_name = 'tbl_' + source_names[1] + '_dispute_details'
            source3_dispute_name = 'tbl_' + source_names[2] + '_dispute_details'
            source4_dispute_name = 'tbl_' + source_names[3] + '_dispute_details'

            source_list = [source1_name, source2_name, source3_name, source4_name]
            source_dispute_list = [source1_dispute_name, source2_dispute_name, source3_dispute_name, source4_dispute_name]

            recon_rule = source_details[0][4]
            probable_match_rule = source_details[0][5]

            ###################################################### RECON RULE QUERYING ###############################################

            update_query = """UPDATE {} SET "overall_recon_status"='Reconciled' FROM {}, {}, {} WHERE {};""".format(
                source1_name,
                source2_name,
                source3_name,
                source4_name,
                recon_rule
            )
            con.execute(update_query)
            # print(update_query)

            update_query = """UPDATE {} SET "overall_recon_status"='Reconciled' FROM {}, {}, {} WHERE {};""".format(
                source2_name,
                source1_name,
                source3_name,
                source4_name,
                recon_rule
            )
            con.execute(update_query)

            update_query = """UPDATE {} SET "overall_recon_status"='Reconciled' FROM {}, {}, {} WHERE {};""".format(
                source3_name,
                source1_name,
                source2_name,
                source4_name,
                recon_rule
            )
            con.execute(update_query)

            update_query = """UPDATE {} SET "overall_recon_status"='Reconciled' FROM {}, {}, {} WHERE {};""".format(
                source4_name,
                source1_name,
                source2_name,
                source3_name,
                recon_rule
            )
            con.execute(update_query)
            # print(update_query)

            recon_rule = [element.rstrip().replace('\n','').replace('\t','') for element in recon_rule.split('AND')]

            for i in range(len(source_list)):
                source_no = 1
                for j in range(len(source_list)):
                    if i != j:
                        # print(i+1, j+1, source_no, '\n')
                        actual_table = source_list[i]
                        specific_recon = source_list[j]

                        specific_rule = ""
                        for k in recon_rule:
                            if actual_table in k and specific_recon in k:
                                specific_rule += k + ' AND'

                        import re
                        update_query = """UPDATE {} SET "{}"='Reconciled' FROM {} WHERE {};""".format(
                                actual_table,
                                "recon_status_" + str(source_no),
                                specific_recon,
                                specific_rule[:-4]
                            )
                        source_no += 1


                        if update_query[-2] == ';':
                            update_query = update_query[:-1]
                        # print(update_query, '\n')
                        con.execute(update_query)

            ###################################################### PROBABLE MATCH RULE QUERYING ###############################################

            update_query = """UPDATE {} SET "overall_probable_status"='Reconciled' FROM {}, {}, {} WHERE {};""".format(
                source1_name,
                source2_name,
                source3_name,
                source4_name,
                probable_match_rule
            )
            con.execute(update_query)

            update_query = """UPDATE {} SET "overall_probable_status"='Reconciled' FROM {}, {}, {} WHERE {};""".format(
                source2_name,
                source1_name,
                source3_name,
                source4_name,
                probable_match_rule
            )
            con.execute(update_query)

            update_query = """UPDATE {} SET "overall_probable_status"='Reconciled' FROM {}, {}, {} WHERE {};""".format(
                source3_name,
                source1_name,
                source2_name,
                source4_name,
                probable_match_rule
            )
            con.execute(update_query)

            update_query = """UPDATE {} SET "overall_probable_status"='Reconciled' FROM {}, {}, {} WHERE {};""".format(
                source4_name,
                source1_name,
                source2_name,
                source3_name,
                probable_match_rule
            )
            con.execute(update_query)
            # print(update_query)

            probable_match_rule = [element.rstrip().replace('\n','').replace('\t','') for element in probable_match_rule.split('AND')]

            for i in range(len(source_list)):
                source_no = 1
                for j in range(len(source_list)):
                    if i != j:
                        actual_table = source_list[i]
                        specific_probable = source_list[j]

                        specific_rule = ""
                        for k in probable_match_rule:
                            if actual_table in k and specific_probable in k:
                                specific_rule += k + ' AND'

                        import re
                        update_query = """UPDATE {} SET "{}"='Reconciled' FROM {} WHERE {};""".format(
                                actual_table,
                                "probable_recon_status_" + str(source_no),
                                specific_probable,
                                specific_rule[:-4]
                            )
                        # print(i+1, j+1, source_no, '\n')
                        source_no += 1


                        if update_query[-2] == ';':
                            update_query = update_query[:-1]
                        # print(update_query, '\n')
                        con.execute(update_query)

                        update_query = """alter table {} rename recon_status_{} to recon_status_{}_to_{};""".format(
                                        source_list[i],
                                        source_no-1,
                                        str(i+1),
                                        str(j+1)
                        )
                        # print(update_query)
                        con.execute(update_query)

                        update_query = """alter table {} rename recon_status_{} to recon_status_{}_to_{};""".format(
                                        source_dispute_list[i],
                                        source_no-1,
                                        str(i+1),
                                        str(j+1)
                        )
                        # print(update_query)
                        con.execute(update_query)

            ######################################### DISPUTE 4 WAY #########################################################

            from sqlalchemy.orm import sessionmaker
            Session = sessionmaker(bind=engine)
            Session.configure(bind=engine) 
            session = Session()

            for i in range(len(source_list)):

                class Tbl_details(Base):
                    __table__ = Table(source_list[i], Base.metadata,
                                    autoload=True, autoload_with=engine)

                class Tbl_dispute_details(Base):
                    __table__ = Table(source_dispute_list[i], Base.metadata,
                                    autoload=True, autoload_with=engine)

                tbl_details = Tbl_details()

                rows = session.query(Tbl_details).order_by(Tbl_details.details_id).all()

                auto_inc = 1
                for each_row in rows:
                    tbl_details_dict = each_row.__dict__
                    for key in tbl_details_dict.copy():
                        if key == '_sa_instance_state':
                            del tbl_details_dict[key]
                    tbl_details_dict['action'] = 'Not Initiated'
                    if tbl_details_dict['overall_recon_status'] == 'Not Reconciled':
                        for key in tbl_details_dict.copy():
                            if key == 'details_id':
                                details_ref_id = tbl_details_dict['details_id']
                                tbl_details_dict['details_ref_id'] = details_ref_id
                                tbl_details_dict['dispute_id'] = auto_inc
                                auto_inc += 1
                                del tbl_details_dict[key]
                        tbl_dispute_details = Tbl_dispute_details()
                        tbl_dispute_details.__dict__.update(tbl_details_dict)
                        session.add(tbl_dispute_details)
                session.commit()
        con.close()
                
    return JsonResponse({"Success":True})

# def run_reconciliation(request):
#     if request.method == "POST":
#         # Convert the data into json
#         data = json.loads(request.body)
#         print(data)
#         recon_id=(data[0]['reconcilation_ref_id'])
#         print(recon_id)
        
#         con = engine.connect()
#         #Load Data
#         recon_operation_arr=(data[0]['reconcilation_operation_arr'])
#         print("Hello")
#         print(recon_operation_arr)
        
#         for each_op_name in recon_operation_arr:
#             operation_ref_id = each_op_name['operation_ref_id']
#             source_name_ref_id = each_op_name['source_name_ref_id']
#             operation_type = con.execute("""select master_key from portal_tbl_master where id ="""
#                                         + operation_ref_id +
#                                         """ and is_deleted= 'N'
#                                         """)
#             source_name = con.execute("""select source_name from portal_tbl_source_mst where id ="""
#                                         + source_name_ref_id +
#                                         """ and is_deleted= 'N' and revision_status = 'Effective'
#                                         """)
#             source_name = list(source_name)[0][0]
#             operation_name = list(operation_type)[0][0]
#             print(list(source_name), list(operation_type))
            
#             if operation_name == 'Load Data':
#                 #########
#                 # source_name = 'redbus_2'  ####### FROM UI                                              ########### Change the name here
#                 tbl_source_details = 'tbl_' + source_name + '_details'                  ########### Change the name here
#                 # file_type = '.xml'

#                 source_query = con.execute("""select master_key from portal_tbl_master where id in
#                                                 (SELECT file_type_ref_id_id FROM public.portal_tbl_source_mst
#                                                 where source_name = '""" + source_name + """' and is_deleted= 'N')
#                                                 and is_deleted= 'N'
#                                                 """)

#                 source_query = list(source_query)
#                 # print(source_query)
#                 file_type = '.' + source_query[0][0].lower()
#                 # print(source_query)
#                 ########################################## GET TABLE DETAILS ###############################################################
#                 recon_query = con.execute("""SELECT column_name, data_type, character_maximum_length
#                                             FROM information_schema.columns
#                                             WHERE table_schema = 'public'
#                                             AND table_name   = '""" + tbl_source_details + """'""")

#                 recon_query = list(recon_query)

#                 column_details = {}
#                 for column_name, column_data_type, character_maximum_length in recon_query:
#                     column_details[column_name] = [column_data_type, character_maximum_length]

#                 # print(column_details)

#                 ######################################### LOAD FROM FTP ##################################################################

#                 from ftplib import FTP
#                 import io
#                 import pandas as pd

#                 ftp = FTP()
#                 ftp.connect('67.209.122.211', timeout=100)
#                 ftp.login('recon','recon')
#                 # ftp.cwd('/home/server/recon-data/')
#                 download_file = io.BytesIO()
#                 file_name = source_name + file_type
#                 # print(file_name)
#                 ftp.retrbinary("RETR " + file_name ,open('data/' + file_name, 'wb').write)
#                 # exit(0)

#                 ############################################### LOAD FROM SOURCE ##################################################################

#                 if file_type == '.csv':
#                     dataframe = pd.read_csv('data/' + source_name + file_type)

#                 elif file_type == '.json':
#                     dataframe = pd.read_json('data/' + source_name + file_type)

#                 elif file_type == '.xml':

#                     import xml.etree.ElementTree as ET
#                     import codecs

#                     with codecs.open('data/' + source_name + file_type, 'r', encoding='utf8') as f:
#                         tt = f.read()


#                     def xml2df(xml_data):
#                         root = ET.XML(xml_data)
#                         all_records = []
#                         for child in root:
#                             record = {}
#                             for sub_child in child:
#                                 record[sub_child.tag] = sub_child.text
#                             all_records.append(record)
#                         return pd.DataFrame(all_records)


#                     dataframe = xml2df(tt)

#                 # dataframe.columns = ['_'.join(list(map(str, each_column.rstrip().split()))).lower() for each_column in list(dataframe)]

#                 ################################################ INSERT INTO TABLE #################################################################

#                 from sqlalchemy.orm import sessionmaker
#                 Session = sessionmaker(bind=engine)
#                 Session.configure(bind=engine) 
#                 session = Session()

#                 class Tbl_details(Base):
#                     __table__ = Table(tbl_source_details, Base.metadata,
#                                     autoload=True, autoload_with=engine)

#                 for i in range(len(dataframe.axes[0])):
#                     row = {}
#                     auto_inc = 1
#                     for j in range(len(list(dataframe.iloc[i, :]))):
#                         if list(dataframe)[j] in column_details:
#                             for column_name in column_details:
#                                 if column_name == list(dataframe)[j]:
#                                     if column_details[column_name][0] == 'integer':
#                                         try:
#                                             row[list(dataframe)[j]] = int(str(dataframe.iloc[i, :][j]).replace(",", ""))
#                                         except:
#                                             row[list(dataframe)[j]] = None
#                                     elif column_details[column_name][0] == 'real':
#                                         try:
#                                             row[list(dataframe)[j]] = float(str(dataframe.iloc[i, :][j]).replace(",", ""))
#                                         except:
#                                             row[list(dataframe)[j]] = None
#                                     elif column_details[column_name][0] == 'character varying' or 'text':
#                                         try:
#                                             if column_details[column_name][1] == None:
#                                                 row[list(dataframe)[j]] = str(dataframe.iloc[i, :][j]).replace("'", '"')
#                                             else:   
#                                                 row[list(dataframe)[j]] = str(dataframe.iloc[i, :][j]).replace("'", '"')[:column_details[column_name][1]]
#                                         except:
#                                             row[list(dataframe)[j]] = None
#                                     elif column_details[column_name][0] == 'date':
#                                         try:
#                                             date = str(parse(str(dataframe.iloc[i, :][j])).strftime("%Y/%m/%d")).split('/')
#                                             row[list(dataframe)[j]] = datetime.date(int(date[0]), int(date[1]), int(date[2]))
#                                         except:
#                                             row[list(dataframe)[j]] = None
#                                     elif column_details[column_name][0] == 'boolean':
#                                         try:
#                                             if dataframe.iloc[i, :][j] in ['true', 'false', 't', 'f', 'yes', 'no', 'y', 'n', '1', '0']:
#                                                 row[list(dataframe)[j]] = dataframe.iloc[i, :][j]
#                                             else:
#                                                 row[list(dataframe)[j]] = None
#                                         except:
#                                             row[list(dataframe)[j]] = None

#                     row['overall_recon_status'] = 'Not Reconciled'
#                     row['recon_status_1'] = 'Not Reconciled'
#                     row['recon_status_2'] = 'Not Reconciled'
#                     row['recon_status_3'] = 'Not Reconciled'
#                     row['overall_probable_status'] = 'Not Reconciled'
#                     row['probable_recon_status_1'] = 'Not Reconciled'
#                     row['probable_recon_status_2'] = 'Not Reconciled'
#                     row['probable_recon_status_3'] = 'Not Reconciled'
#                     row['details_id'] = i+1
#                     # print(row)
#                     tbl_details = Tbl_details()
#                     tbl_details.__dict__.update(row)
#                     session.add(tbl_details)
#                         # print(list(dataframe)[j])
#                         # print(dataframe.iloc[i, :][j])

#                 # tbl_details = Tbl_details()
#                 # session.add(tbl_details)
#                 session.commit()
#                 # print(tbl_details.transaction_id)
            
#             elif operation_name == 'Run Recon':
            
#                 #Load Data ends
#                 recon_type = con.execute("""select master_key from portal_tbl_master where id in
#                                             (SELECT recon_type_ref_id_id FROM public.portal_tbl_reconcilation_definition_mst
#                                             where id=""" + str(recon_id) + """ and is_deleted= 'N')
#                                             and is_deleted= 'N'
#                                             """)
#                 source_details = con.execute("""SELECT source_name1_ref_id_id, source_name2_ref_id_id, source_name3_ref_id_id,
#                                             source_name4_ref_id_id, recon_rule, probable_match_rule, is_deleted, recon_type_ref_id_id
#                                             FROM public.portal_tbl_reconcilation_definition_mst
#                                             where id = """ + str(recon_id)
#                                             )
#                 recon_type = list(recon_type)
#                 source_details = list(source_details)

#                 print(source_details, recon_type)
                
#                 ################################################### TWO WAY ####################################################################

#                 if source_details[0][0] and source_details[0][1] and not source_details[0][2] and not source_details[0][3] and recon_type[0][0] == 'Two-way':
#                     source_names = []*2
#                     for i in range(2):
#                         source_name_query = con.execute("""SELECT source_name FROM public.portal_tbl_source_mst where id = """ + str(source_details[0][i]) + """;""")
#                         source_name_query = list(source_name_query)
#                         source_names.append(source_name_query[0][0])

#                     source1_name = 'tbl_' + source_names[0] + '_details'
#                     source2_name = 'tbl_' + source_names[1] + '_details'

#                     source1_dispute_name = 'tbl_' + source_names[0] + '_dispute_details'
#                     source2_dispute_name = 'tbl_' + source_names[1] + '_dispute_details'

#                     source_list = [source1_name, source2_name]
#                     source_dispute_list = [source1_dispute_name, source2_dispute_name]

#                     recon_rule = source_details[0][4]
#                     probable_match_rule = source_details[0][5]

#                 ###################################################### RECON RULE QUERYING ###############################################

#                     update_query = """UPDATE {} SET "overall_recon_status"='Reconciled' FROM {} WHERE {};""".format(
#                         source1_name,
#                         source2_name,
#                         recon_rule
#                     )
#                     con.execute(update_query)
#                     print(update_query)
                    
#                     update_query = """UPDATE {} SET "overall_recon_status"='Reconciled' FROM {} WHERE {};""".format(
#                         source2_name,
#                         source1_name,
#                         recon_rule
#                     )
#                     con.execute(update_query)
#                     print(update_query)

#                     recon_rule = [element.rstrip().replace('\n','').replace('\t','') for element in recon_rule.split('AND')]

#                     for i in range(len(source_list)):
#                         source_no = 1
#                         for j in range(len(source_list)):
#                             if i != j:
#                                 # print(i+1, j+1, source_no, '\n')
#                                 actual_table = source_list[i]
#                                 specific_recon = source_list[j]

#                                 specific_rule = ""
#                                 for k in recon_rule:
#                                     if actual_table in k and specific_recon in k:
#                                         specific_rule += k + ' AND'

#                                 import re
#                                 update_query = """UPDATE {} SET "{}"='Reconciled' FROM {} WHERE {};""".format(
#                                         actual_table,
#                                         "recon_status_" + str(source_no),
#                                         specific_recon,
#                                         specific_rule[:-4]
#                                     )
#                                 source_no += 1


#                                 if update_query[-2] == ';':
#                                     update_query = update_query[:-1]
#                                 # print(update_query, '\n')
#                                 con.execute(update_query)

#                     ###################################################### PROBABLE MATCH RULE QUERYING ###############################################

#                     update_query = """UPDATE {} SET "overall_probable_status"='Reconciled' FROM {} WHERE {};""".format(
#                         source1_name,
#                         source2_name,
#                         probable_match_rule
#                     )
#                     con.execute(update_query)

#                     update_query = """UPDATE {} SET "overall_probable_status"='Reconciled' FROM {} WHERE {};""".format(
#                         source2_name,
#                         source1_name,
#                         probable_match_rule
#                     )
#                     con.execute(update_query)

#                     probable_match_rule = [element.rstrip().replace('\n','').replace('\t','') for element in probable_match_rule.split('AND')]

#                     for i in range(len(source_list)):
#                         source_no = 1
#                         for j in range(len(source_list)):
#                             if i != j:
#                                 actual_table = source_list[i]
#                                 specific_probable = source_list[j]

#                                 specific_rule = ""
#                                 for k in probable_match_rule:
#                                     if actual_table in k and specific_probable in k:
#                                         specific_rule += k + ' AND'

#                                 import re
#                                 update_query = """UPDATE {} SET "{}"='Reconciled' FROM {} WHERE {};""".format(
#                                         actual_table,
#                                         "probable_recon_status_" + str(source_no),
#                                         specific_probable,
#                                         specific_rule[:-4]
#                                     )
#                                 # print(i+1, j+1, source_no, '\n')
#                                 source_no += 1


#                                 if update_query[-2] == ';':
#                                     update_query = update_query[:-1]
#                                 # print(update_query, '\n')
#                                 con.execute(update_query)

#                                 update_query = """alter table {} rename recon_status_{} to recon_status_{}_to_{};""".format(
#                                                 source_list[i],
#                                                 source_no-1,
#                                                 str(i+1),
#                                                 str(j+1)
#                                 )
#                                 # print(update_query)
#                                 con.execute(update_query)

#                                 update_query = """alter table {} rename recon_status_{} to recon_status_{}_to_{};""".format(
#                                                 source_dispute_list[i],
#                                                 source_no-1,
#                                                 str(i+1),
#                                                 str(j+1)
#                                 )
#                                 # print(update_query)
#                                 con.execute(update_query)

#                                 update_query = """alter table {} rename probable_recon_status_{} to probable_recon_status_{}_to_{};""".format(
#                                                 source_list[i],
#                                                 source_no-1,
#                                                 str(i+1),
#                                                 str(j+1)
#                                 )
#                                 # print(update_query)
#                                 con.execute(update_query)

#                                 update_query = """alter table {} rename probable_recon_status_{} to probable_recon_status_{}_to_{};""".format(
#                                                 source_dispute_list[i],
#                                                 source_no-1,
#                                                 str(i+1),
#                                                 str(j+1)
#                                 )
#                                 # print(update_query)
#                                 con.execute(update_query)
#                     con.close()
#                     con = engine.connect()
#                     ######################################### DISPUTE 2 WAY #########################################################
                    
#                     from sqlalchemy.orm import sessionmaker
#                     Session = sessionmaker(bind=engine)
#                     Session.configure(bind=engine) 
#                     session = Session()
#                     print("DISPUTE 2 WAY")     
#                     for i in range(len(source_list)):

#                         class Tbl_details(Base):
#                             __table__ = Table(source_list[i], Base.metadata,
#                                             autoload=True, autoload_with=engine)

#                         class Tbl_dispute_details(Base):
#                             __table__ = Table(source_dispute_list[i], Base.metadata,
#                                             autoload=True, autoload_with=engine)

#                         tbl_details = Tbl_details()

#                         rows = session.query(Tbl_details).order_by(Tbl_details.details_id).all()

#                         auto_inc = 1
#                         for each_row in rows:
#                             tbl_details_dict = each_row.__dict__
#                             for key in tbl_details_dict.copy():
#                                 if key == '_sa_instance_state':
#                                     del tbl_details_dict[key]
#                             tbl_details_dict['action'] = 'Not Initiated'
#                             if tbl_details_dict['overall_recon_status'] == 'Not Reconciled':
#                                 for key in tbl_details_dict.copy():
#                                     if key == 'details_id':
#                                         details_ref_id = tbl_details_dict['details_id']
#                                         tbl_details_dict['details_ref_id'] = details_ref_id
#                                         tbl_details_dict['dispute_id'] = auto_inc
#                                         auto_inc += 1
#                                         del tbl_details_dict[key]
#                                 tbl_dispute_details = Tbl_dispute_details()
#                                 tbl_dispute_details.__dict__.update(tbl_details_dict)
#                                 session.add(tbl_dispute_details)
#                         session.commit()

#                 ################################################### THREE WAY ####################################################################

#                 if source_details[0][0] and source_details[0][1] and source_details[0][2] and not source_details[0][3] and recon_type[0][0] == 'Three-way':
#                     source_names = []*3
#                     for i in range(3):
#                         source_name_query = con.execute("""SELECT source_name FROM public.portal_tbl_source_mst where id = """ + str(source_details[0][i]) + """;""")
#                         source_name_query = list(source_name_query)
#                         source_names.append(source_name_query[0][0])

#                     source1_name = 'tbl_' + source_names[0] + '_details'
#                     source2_name = 'tbl_' + source_names[1] + '_details'
#                     source3_name = 'tbl_' + source_names[2] + '_details'

#                     source1_dispute_name = 'tbl_' + source_names[0] + '_dispute_details'
#                     source2_dispute_name = 'tbl_' + source_names[1] + '_dispute_details'
#                     source3_dispute_name = 'tbl_' + source_names[2] + '_dispute_details'

#                     source_list = [source1_name, source2_name, source3_name]
#                     source_dispute_list = [source1_dispute_name, source2_dispute_name, source3_dispute_name]

#                     recon_rule = source_details[0][4]
#                     probable_match_rule = source_details[0][5]

#                 ###################################################### RECON RULE QUERYING ###############################################

#                     update_query = """UPDATE {} SET "overall_recon_status"='Reconciled' FROM {}, {} WHERE {};""".format(
#                         source1_name,
#                         source2_name,
#                         source3_name,
#                         recon_rule
#                     )
#                     con.execute(update_query)

#                     update_query = """UPDATE {} SET "overall_recon_status"='Reconciled' FROM {}, {} WHERE {};""".format(
#                         source2_name,
#                         source1_name,
#                         source3_name,
#                         recon_rule
#                     )
#                     con.execute(update_query)

#                     update_query = """UPDATE {} SET "overall_recon_status"='Reconciled' FROM {}, {} WHERE {};""".format(
#                         source3_name,
#                         source1_name,
#                         source2_name,
#                         recon_rule
#                     )
#                     con.execute(update_query)

#                     ###################################################### PROBABLE MATCH RULE QUERYING ###############################################

#                     update_query = """UPDATE {} SET "overall_probable_status"='Reconciled' FROM {}, {} WHERE {};""".format(
#                         source1_name,
#                         source2_name,
#                         source3_name,
#                         probable_match_rule
#                     )
#                     con.execute(update_query)

#                     update_query = """UPDATE {} SET "overall_probable_status"='Reconciled' FROM {}, {} WHERE {};""".format(
#                         source2_name,
#                         source1_name,
#                         source3_name,
#                         probable_match_rule
#                     )
#                     con.execute(update_query)

#                     update_query = """UPDATE {} SET "overall_probable_status"='Reconciled' FROM {}, {} WHERE {};""".format(
#                         source3_name,
#                         source1_name,
#                         source2_name,
#                         probable_match_rule
#                     )
#                     con.execute(update_query)

#             ######################################### DISPUTE 3 WAY #########################################################

#                     from sqlalchemy.orm import sessionmaker
#                     Session = sessionmaker(bind=engine)
#                     Session.configure(bind=engine) 
#                     session = Session()

#                     for i in range(len(source_list)):

#                         class Tbl_details(Base):
#                             __table__ = Table(source_list[i], Base.metadata,
#                                             autoload=True, autoload_with=engine)

#                         class Tbl_dispute_details(Base):
#                             __table__ = Table(source_dispute_list[i], Base.metadata,
#                                             autoload=True, autoload_with=engine)

#                         tbl_details = Tbl_details()

#                         rows = session.query(Tbl_details).all()

#                         for each_row in rows:
#                             tbl_details_dict = each_row.__dict__
#                             for key in tbl_details_dict.copy():
#                                 if key == '_sa_instance_state':
#                                     del tbl_details_dict[key]
#                             tbl_details_dict['action'] = 'Not Initiated'
#                             if tbl_details_dict['overall_recon_status'] == 'Not Reconciled':
#                                 tbl_dispute_details = Tbl_dispute_details()
#                                 tbl_dispute_details.__dict__.update(tbl_details_dict)
#                                 session.add(tbl_dispute_details)

#                         session.commit()

#             ################################################### FOUR WAY ####################################################################

#                 if source_details[0][0] and source_details[0][1] and source_details[0][2] and source_details[0][3] and recon_type[0][0] == 'Four-way':
#                     source_names = []*4
#                     for i in range(4):
#                         source_name_query = con.execute("""SELECT source_name FROM public.portal_tbl_source_mst where id = """ + str(source_details[0][i]) + """;""")
#                         source_name_query = list(source_name_query)
#                         source_names.append(source_name_query[0][0])

#                     source1_name = 'tbl_' + source_names[0] + '_details'
#                     source2_name = 'tbl_' + source_names[1] + '_details'
#                     source3_name = 'tbl_' + source_names[2] + '_details'
#                     source4_name = 'tbl_' + source_names[3] + '_details'

#                     source1_dispute_name = 'tbl_' + source_names[0] + '_dispute_details'
#                     source2_dispute_name = 'tbl_' + source_names[1] + '_dispute_details'
#                     source3_dispute_name = 'tbl_' + source_names[2] + '_dispute_details'
#                     source4_dispute_name = 'tbl_' + source_names[3] + '_dispute_details'

#                     source_list = [source1_name, source2_name, source3_name, source4_name]
#                     source_dispute_list = [source1_dispute_name, source2_dispute_name, source3_dispute_name, source4_dispute_name]

#                     recon_rule = source_details[0][4]
#                     probable_match_rule = source_details[0][5]

#                     ###################################################### RECON RULE QUERYING ###############################################

#                     update_query = """UPDATE {} SET "overall_recon_status"='Reconciled' FROM {}, {}, {} WHERE {};""".format(
#                         source1_name,
#                         source2_name,
#                         source3_name,
#                         source4_name,
#                         recon_rule
#                     )
#                     con.execute(update_query)
#                     # print(update_query)

#                     update_query = """UPDATE {} SET "overall_recon_status"='Reconciled' FROM {}, {}, {} WHERE {};""".format(
#                         source2_name,
#                         source1_name,
#                         source3_name,
#                         source4_name,
#                         recon_rule
#                     )
#                     con.execute(update_query)

#                     update_query = """UPDATE {} SET "overall_recon_status"='Reconciled' FROM {}, {}, {} WHERE {};""".format(
#                         source3_name,
#                         source1_name,
#                         source2_name,
#                         source4_name,
#                         recon_rule
#                     )
#                     con.execute(update_query)

#                     update_query = """UPDATE {} SET "overall_recon_status"='Reconciled' FROM {}, {}, {} WHERE {};""".format(
#                         source4_name,
#                         source1_name,
#                         source2_name,
#                         source3_name,
#                         recon_rule
#                     )
#                     con.execute(update_query)
#                     # print(update_query)

#                     recon_rule = [element.rstrip().replace('\n','').replace('\t','') for element in recon_rule.split('AND')]

#                     for i in range(len(source_list)):
#                         source_no = 1
#                         for j in range(len(source_list)):
#                             if i != j:
#                                 # print(i+1, j+1, source_no, '\n')
#                                 actual_table = source_list[i]
#                                 specific_recon = source_list[j]

#                                 specific_rule = ""
#                                 for k in recon_rule:
#                                     if actual_table in k and specific_recon in k:
#                                         specific_rule += k + ' AND'

#                                 import re
#                                 update_query = """UPDATE {} SET "{}"='Reconciled' FROM {} WHERE {};""".format(
#                                         actual_table,
#                                         "recon_status_" + str(source_no),
#                                         specific_recon,
#                                         specific_rule[:-4]
#                                     )
#                                 source_no += 1


#                                 if update_query[-2] == ';':
#                                     update_query = update_query[:-1]
#                                 # print(update_query, '\n')
#                                 con.execute(update_query)

#                     ###################################################### PROBABLE MATCH RULE QUERYING ###############################################

#                     update_query = """UPDATE {} SET "overall_probable_status"='Reconciled' FROM {}, {}, {} WHERE {};""".format(
#                         source1_name,
#                         source2_name,
#                         source3_name,
#                         source4_name,
#                         probable_match_rule
#                     )
#                     con.execute(update_query)

#                     update_query = """UPDATE {} SET "overall_probable_status"='Reconciled' FROM {}, {}, {} WHERE {};""".format(
#                         source2_name,
#                         source1_name,
#                         source3_name,
#                         source4_name,
#                         probable_match_rule
#                     )
#                     con.execute(update_query)

#                     update_query = """UPDATE {} SET "overall_probable_status"='Reconciled' FROM {}, {}, {} WHERE {};""".format(
#                         source3_name,
#                         source1_name,
#                         source2_name,
#                         source4_name,
#                         probable_match_rule
#                     )
#                     con.execute(update_query)

#                     update_query = """UPDATE {} SET "overall_probable_status"='Reconciled' FROM {}, {}, {} WHERE {};""".format(
#                         source4_name,
#                         source1_name,
#                         source2_name,
#                         source3_name,
#                         probable_match_rule
#                     )
#                     con.execute(update_query)
#                     # print(update_query)

#                     probable_match_rule = [element.rstrip().replace('\n','').replace('\t','') for element in probable_match_rule.split('AND')]

#                     for i in range(len(source_list)):
#                         source_no = 1
#                         for j in range(len(source_list)):
#                             if i != j:
#                                 actual_table = source_list[i]
#                                 specific_probable = source_list[j]

#                                 specific_rule = ""
#                                 for k in probable_match_rule:
#                                     if actual_table in k and specific_probable in k:
#                                         specific_rule += k + ' AND'

#                                 import re
#                                 update_query = """UPDATE {} SET "{}"='Reconciled' FROM {} WHERE {};""".format(
#                                         actual_table,
#                                         "probable_recon_status_" + str(source_no),
#                                         specific_probable,
#                                         specific_rule[:-4]
#                                     )
#                                 # print(i+1, j+1, source_no, '\n')
#                                 source_no += 1


#                                 if update_query[-2] == ';':
#                                     update_query = update_query[:-1]
#                                 # print(update_query, '\n')
#                                 con.execute(update_query)

#                                 update_query = """alter table {} rename recon_status_{} to recon_status_{}_to_{};""".format(
#                                                 source_list[i],
#                                                 source_no-1,
#                                                 str(i+1),
#                                                 str(j+1)
#                                 )
#                                 # print(update_query)
#                                 con.execute(update_query)

#                                 update_query = """alter table {} rename recon_status_{} to recon_status_{}_to_{};""".format(
#                                                 source_dispute_list[i],
#                                                 source_no-1,
#                                                 str(i+1),
#                                                 str(j+1)
#                                 )
#                                 # print(update_query)
#                                 con.execute(update_query)

#                     ######################################### DISPUTE 4 WAY #########################################################

#                     from sqlalchemy.orm import sessionmaker
#                     Session = sessionmaker(bind=engine)
#                     Session.configure(bind=engine) 
#                     session = Session()

#                     for i in range(len(source_list)):

#                         class Tbl_details(Base):
#                             __table__ = Table(source_list[i], Base.metadata,
#                                             autoload=True, autoload_with=engine)

#                         class Tbl_dispute_details(Base):
#                             __table__ = Table(source_dispute_list[i], Base.metadata,
#                                             autoload=True, autoload_with=engine)

#                         tbl_details = Tbl_details()

#                         rows = session.query(Tbl_details).order_by(Tbl_details.details_id).all()

#                         auto_inc = 1
#                         for each_row in rows:
#                             tbl_details_dict = each_row.__dict__
#                             for key in tbl_details_dict.copy():
#                                 if key == '_sa_instance_state':
#                                     del tbl_details_dict[key]
#                             tbl_details_dict['action'] = 'Not Initiated'
#                             if tbl_details_dict['overall_recon_status'] == 'Not Reconciled':
#                                 for key in tbl_details_dict.copy():
#                                     if key == 'details_id':
#                                         details_ref_id = tbl_details_dict['details_id']
#                                         tbl_details_dict['details_ref_id'] = details_ref_id
#                                         tbl_details_dict['dispute_id'] = auto_inc
#                                         auto_inc += 1
#                                         del tbl_details_dict[key]
#                                 tbl_dispute_details = Tbl_dispute_details()
#                                 tbl_dispute_details.__dict__.update(tbl_details_dict)
#                                 session.add(tbl_dispute_details)
#                         session.commit()
#         con.close()
#     return JsonResponse({"Success":True})

@csrf_exempt
def load_data(request):
    if request.method == "POST":
        # Convert the data into json
        data = json.loads(request.body)
        recon_id=(data[0]['reconcilation_ref_id'])
        con = engine.connect()
        #Load Data
        recon_operation_arr=(data[0]['reconcilation_operation_arr'])
        print(recon_operation_arr)
        for each_op_name in recon_operation_arr:
            operation_ref_id = each_op_name['operation_ref_id']
            source_name_ref_id = each_op_name['source_name_ref_id']
            operation_type = con.execute("""select master_key from portal_tbl_master where id ="""
                                        + operation_ref_id +
                                        """ and is_deleted= 'N'
                                        """)
            source_name = con.execute("""select source_name from portal_tbl_source_mst where id ="""
                                        + source_name_ref_id +
                                        """ and is_deleted= 'N' and revision_status = 'Effective'
                                        """)
            source_name = list(source_name)[0][0]
            operation_name = list(operation_type)[0][0]
            print(list(source_name), list(operation_type))
            
            if operation_name == 'Load Data':
                #########
                # source_name = 'redbus_2'  ####### FROM UI                                              ########### Change the name here
                tbl_source_details = 'tbl_' + source_name + '_details'                  ########### Change the name here
                # file_type = '.xml'

                source_query = con.execute("""select master_key from portal_tbl_master where id in
                                                (SELECT file_type_ref_id_id FROM public.portal_tbl_source_mst
                                                where source_name = '""" + source_name + """' and is_deleted= 'N')
                                                and is_deleted= 'N'
                                                """)

                source_query = list(source_query)
                # print(source_query)
                file_type = '.' + source_query[0][0].lower()
                # print(source_query)
                ########################################## GET TABLE DETAILS ###############################################################
                recon_query = con.execute("""SELECT column_name, data_type, character_maximum_length
                                            FROM information_schema.columns
                                            WHERE table_schema = 'public'
                                            AND table_name   = '""" + tbl_source_details + """'""")

                recon_query = list(recon_query)

                column_details = {}
                for column_name, column_data_type, character_maximum_length in recon_query:
                    column_details[column_name] = [column_data_type, character_maximum_length]

                # print(column_details)

                ######################################### LOAD FROM FTP ##################################################################

                from ftplib import FTP
                import io
                import pandas as pd

                ftp = FTP()
                ftp.connect('67.209.122.211', timeout=100)
                ftp.login('recon','recon')
                # ftp.cwd('/home/server/recon-data/')
                download_file = io.BytesIO()
                file_name = source_name + file_type
                # print(file_name)
                ftp.retrbinary("RETR " + file_name ,open('data/' + file_name, 'wb').write)
                # exit(0)

                ############################################### LOAD FROM SOURCE ##################################################################

                if file_type == '.csv':
                    dataframe = pd.read_csv('data/' + source_name + file_type)

                elif file_type == '.json':
                    dataframe = pd.read_json('data/' + source_name + file_type)

                elif file_type == '.xml':

                    import xml.etree.ElementTree as ET
                    import codecs

                    with codecs.open('data/' + source_name + file_type, 'r', encoding='utf8') as f:
                        tt = f.read()


                    def xml2df(xml_data):
                        root = ET.XML(xml_data)
                        all_records = []
                        for child in root:
                            record = {}
                            for sub_child in child:
                                record[sub_child.tag] = sub_child.text
                            all_records.append(record)
                        return pd.DataFrame(all_records)


                    dataframe = xml2df(tt)

                # dataframe.columns = ['_'.join(list(map(str, each_column.rstrip().split()))).lower() for each_column in list(dataframe)]

                ################################################ INSERT INTO TABLE #################################################################

                from sqlalchemy.orm import sessionmaker
                Session = sessionmaker(bind=engine)
                Session.configure(bind=engine) 
                session = Session()

                class Tbl_details(Base):
                    __table__ = Table(tbl_source_details, Base.metadata,
                                    autoload=True, autoload_with=engine)

                for i in range(len(dataframe.axes[0])):
                    row = {}
                    auto_inc = 1
                    for j in range(len(list(dataframe.iloc[i, :]))):
                        if list(dataframe)[j] in column_details:
                            for column_name in column_details:
                                if column_name == list(dataframe)[j]:
                                    if column_details[column_name][0] == 'integer':
                                        try:
                                            row[list(dataframe)[j]] = int(str(dataframe.iloc[i, :][j]).replace(",", ""))
                                        except:
                                            row[list(dataframe)[j]] = None
                                    elif column_details[column_name][0] == 'real':
                                        try:
                                            row[list(dataframe)[j]] = float(str(dataframe.iloc[i, :][j]).replace(",", ""))
                                        except:
                                            row[list(dataframe)[j]] = None
                                    elif column_details[column_name][0] == 'character varying' or 'text':
                                        try:
                                            if column_details[column_name][1] == None:
                                                row[list(dataframe)[j]] = str(dataframe.iloc[i, :][j]).replace("'", '"')
                                            else:   
                                                row[list(dataframe)[j]] = str(dataframe.iloc[i, :][j]).replace("'", '"')[:column_details[column_name][1]]
                                        except:
                                            row[list(dataframe)[j]] = None
                                    elif column_details[column_name][0] == 'date':
                                        try:
                                            date = str(parse(str(dataframe.iloc[i, :][j])).strftime("%Y/%m/%d")).split('/')
                                            row[list(dataframe)[j]] = datetime.date(int(date[0]), int(date[1]), int(date[2]))
                                        except:
                                            row[list(dataframe)[j]] = None
                                    elif column_details[column_name][0] == 'boolean':
                                        try:
                                            if dataframe.iloc[i, :][j] in ['true', 'false', 't', 'f', 'yes', 'no', 'y', 'n', '1', '0']:
                                                row[list(dataframe)[j]] = dataframe.iloc[i, :][j]
                                            else:
                                                row[list(dataframe)[j]] = None
                                        except:
                                            row[list(dataframe)[j]] = None

                    row['overall_recon_status'] = 'Not Reconciled'
                    row['recon_status_1'] = 'Not Reconciled'
                    row['recon_status_2'] = 'Not Reconciled'
                    row['recon_status_3'] = 'Not Reconciled'
                    row['overall_probable_status'] = 'Not Reconciled'
                    row['probable_recon_status_1'] = 'Not Reconciled'
                    row['probable_recon_status_2'] = 'Not Reconciled'
                    row['probable_recon_status_3'] = 'Not Reconciled'
                    row['details_id'] = i+1
                    # print(row)
                    tbl_details = Tbl_details()
                    tbl_details.__dict__.update(row)
                    session.add(tbl_details)
                        # print(list(dataframe)[j])
                        # print(dataframe.iloc[i, :][j])

                # tbl_details = Tbl_details()
                # session.add(tbl_details)
                session.commit()
                # print(tbl_details.transaction_id)
            
            elif operation_name == 'Run Recon':
            
                #Load Data ends
                recon_type = con.execute("""select master_key from portal_tbl_master where id in
                                            (SELECT recon_type_ref_id_id FROM public.portal_tbl_reconcilation_definition_mst
                                            where id=""" + str(recon_id) + """ and is_deleted= 'N')
                                            and is_deleted= 'N'
                                            """)
                source_details = con.execute("""SELECT source_name1_ref_id_id, source_name2_ref_id_id, source_name3_ref_id_id,
                                            source_name4_ref_id_id, recon_rule, probable_match_rule, is_deleted, recon_type_ref_id_id
                                            FROM public.portal_tbl_reconcilation_definition_mst
                                            where id = """ + str(recon_id)
                                            )
                recon_type = list(recon_type)
                source_details = list(source_details)

                print(source_details, recon_type)
                
                ################################################### TWO WAY ####################################################################

                if source_details[0][0] and source_details[0][1] and not source_details[0][2] and not source_details[0][3] and recon_type[0][0] == 'Two-way':
                    source_names = []*2
                    for i in range(2):
                        source_name_query = con.execute("""SELECT source_name FROM public.portal_tbl_source_mst where id = """ + str(source_details[0][i]) + """;""")
                        source_name_query = list(source_name_query)
                        source_names.append(source_name_query[0][0])

                    source1_name = 'tbl_' + source_names[0] + '_details'
                    source2_name = 'tbl_' + source_names[1] + '_details'

                    source1_dispute_name = 'tbl_' + source_names[0] + '_dispute_details'
                    source2_dispute_name = 'tbl_' + source_names[1] + '_dispute_details'

                    source_list = [source1_name, source2_name]
                    source_dispute_list = [source1_dispute_name, source2_dispute_name]

                    recon_rule = source_details[0][4]
                    probable_match_rule = source_details[0][5]

                ###################################################### RECON RULE QUERYING ###############################################

                    update_query = """UPDATE {} SET "overall_recon_status"='Reconciled' FROM {} WHERE {};""".format(
                        source1_name,
                        source2_name,
                        recon_rule
                    )
                    con.execute(update_query)
                    print(update_query)
                    
                    update_query = """UPDATE {} SET "overall_recon_status"='Reconciled' FROM {} WHERE {};""".format(
                        source2_name,
                        source1_name,
                        recon_rule
                    )
                    con.execute(update_query)
                    print(update_query)

                    recon_rule = [element.rstrip().replace('\n','').replace('\t','') for element in recon_rule.split('AND')]

                    for i in range(len(source_list)):
                        source_no = 1
                        for j in range(len(source_list)):
                            if i != j:
                                # print(i+1, j+1, source_no, '\n')
                                actual_table = source_list[i]
                                specific_recon = source_list[j]

                                specific_rule = ""
                                for k in recon_rule:
                                    if actual_table in k and specific_recon in k:
                                        specific_rule += k + ' AND'

                                import re
                                update_query = """UPDATE {} SET "{}"='Reconciled' FROM {} WHERE {};""".format(
                                        actual_table,
                                        "recon_status_" + str(source_no),
                                        specific_recon,
                                        specific_rule[:-4]
                                    )
                                source_no += 1


                                if update_query[-2] == ';':
                                    update_query = update_query[:-1]
                                # print(update_query, '\n')
                                con.execute(update_query)

                    ###################################################### PROBABLE MATCH RULE QUERYING ###############################################

                    update_query = """UPDATE {} SET "overall_probable_status"='Reconciled' FROM {} WHERE {};""".format(
                        source1_name,
                        source2_name,
                        probable_match_rule
                    )
                    con.execute(update_query)

                    update_query = """UPDATE {} SET "overall_probable_status"='Reconciled' FROM {} WHERE {};""".format(
                        source2_name,
                        source1_name,
                        probable_match_rule
                    )
                    con.execute(update_query)

                    probable_match_rule = [element.rstrip().replace('\n','').replace('\t','') for element in probable_match_rule.split('AND')]

                    for i in range(len(source_list)):
                        source_no = 1
                        for j in range(len(source_list)):
                            if i != j:
                                actual_table = source_list[i]
                                specific_probable = source_list[j]

                                specific_rule = ""
                                for k in probable_match_rule:
                                    if actual_table in k and specific_probable in k:
                                        specific_rule += k + ' AND'

                                import re
                                update_query = """UPDATE {} SET "{}"='Reconciled' FROM {} WHERE {};""".format(
                                        actual_table,
                                        "probable_recon_status_" + str(source_no),
                                        specific_probable,
                                        specific_rule[:-4]
                                    )
                                # print(i+1, j+1, source_no, '\n')
                                source_no += 1


                                if update_query[-2] == ';':
                                    update_query = update_query[:-1]
                                # print(update_query, '\n')
                                con.execute(update_query)
                                
                    ######################################### DISPUTE 2 WAY #########################################################

                    from sqlalchemy.orm import sessionmaker
                    Session = sessionmaker(bind=engine)
                    Session.configure(bind=engine) 
                    session = Session()
                    print("DISPUTE 2 WAY")     
                    for i in range(len(source_list)):

                        class Tbl_details(Base):
                            __table__ = Table(source_list[i], Base.metadata,
                                            autoload=True, autoload_with=engine)

                        class Tbl_dispute_details(Base):
                            __table__ = Table(source_dispute_list[i], Base.metadata,
                                            autoload=True, autoload_with=engine)

                        tbl_details = Tbl_details()

                        rows = session.query(Tbl_details).order_by(Tbl_details.details_id).all()

                        auto_inc = 1
                        for each_row in rows:
                            tbl_details_dict = each_row.__dict__
                            for key in tbl_details_dict.copy():
                                if key == '_sa_instance_state':
                                    del tbl_details_dict[key]
                            tbl_details_dict['action'] = 'Not Initiated'
                            if tbl_details_dict['overall_recon_status'] == 'Not Reconciled':
                                for key in tbl_details_dict.copy():
                                    if key == 'details_id':
                                        details_ref_id = tbl_details_dict['details_id']
                                        tbl_details_dict['details_ref_id'] = details_ref_id
                                        tbl_details_dict['dispute_id'] = auto_inc
                                        auto_inc += 1
                                        del tbl_details_dict[key]
                                tbl_dispute_details = Tbl_dispute_details()
                                tbl_dispute_details.__dict__.update(tbl_details_dict)
                                session.add(tbl_dispute_details)
                        session.commit()
                    
                    con.close()
                    con = engine.connect()

                    ####################################### ALTER TABLE COLUMN NAMES #############################################
                    for i in range(len(source_list)):
                        source_no = 1
                        for j in range(len(source_list)):
                            if i != j:
                                source_no += 1
                                update_query = """alter table {} rename recon_status_{} to recon_status_{}_to_{};""".format(
                                                source_list[i],
                                                source_no-1,
                                                str(i+1),
                                                str(j+1)
                                )
                                # print(update_query)
                                con.execute(update_query)

                                update_query = """alter table {} rename recon_status_{} to recon_status_{}_to_{};""".format(
                                                source_dispute_list[i],
                                                source_no-1,
                                                str(i+1),
                                                str(j+1)
                                )
                                # print(update_query)
                                con.execute(update_query)

                                update_query = """alter table {} rename probable_recon_status_{} to probable_recon_status_{}_to_{};""".format(
                                                source_list[i],
                                                source_no-1,
                                                str(i+1),
                                                str(j+1)
                                )
                                # print(update_query)
                                con.execute(update_query)

                                update_query = """alter table {} rename probable_recon_status_{} to probable_recon_status_{}_to_{};""".format(
                                                source_dispute_list[i],
                                                source_no-1,
                                                str(i+1),
                                                str(j+1)
                                )
                                # print(update_query)
                                con.execute(update_query)

                ################################################### THREE WAY ####################################################################

                if source_details[0][0] and source_details[0][1] and source_details[0][2] and not source_details[0][3] and recon_type[0][0] == 'Three-way':
                    source_names = []*3
                    for i in range(3):
                        source_name_query = con.execute("""SELECT source_name FROM public.portal_tbl_source_mst where id = """ + str(source_details[0][i]) + """;""")
                        source_name_query = list(source_name_query)
                        source_names.append(source_name_query[0][0])

                    source1_name = 'tbl_' + source_names[0] + '_details'
                    source2_name = 'tbl_' + source_names[1] + '_details'
                    source3_name = 'tbl_' + source_names[2] + '_details'

                    source1_dispute_name = 'tbl_' + source_names[0] + '_dispute_details'
                    source2_dispute_name = 'tbl_' + source_names[1] + '_dispute_details'
                    source3_dispute_name = 'tbl_' + source_names[2] + '_dispute_details'

                    source_list = [source1_name, source2_name, source3_name]
                    source_dispute_list = [source1_dispute_name, source2_dispute_name, source3_dispute_name]

                    recon_rule = source_details[0][4]
                    probable_match_rule = source_details[0][5]

                ###################################################### RECON RULE QUERYING ###############################################

                    update_query = """UPDATE {} SET "overall_recon_status"='Reconciled' FROM {}, {} WHERE {};""".format(
                        source1_name,
                        source2_name,
                        source3_name,
                        recon_rule
                    )
                    con.execute(update_query)

                    update_query = """UPDATE {} SET "overall_recon_status"='Reconciled' FROM {}, {} WHERE {};""".format(
                        source2_name,
                        source1_name,
                        source3_name,
                        recon_rule
                    )
                    con.execute(update_query)

                    update_query = """UPDATE {} SET "overall_recon_status"='Reconciled' FROM {}, {} WHERE {};""".format(
                        source3_name,
                        source1_name,
                        source2_name,
                        recon_rule
                    )
                    con.execute(update_query)

                    recon_rule = [element.rstrip().replace('\n','').replace('\t','') for element in recon_rule.split('AND')]

                    for i in range(len(source_list)):
                        source_no = 1
                        for j in range(len(source_list)):
                            if i != j:
                                # print(i+1, j+1, source_no, '\n')
                                actual_table = source_list[i]
                                specific_recon = source_list[j]

                                specific_rule = ""
                                for k in recon_rule:
                                    if actual_table in k and specific_recon in k:
                                        specific_rule += k + ' AND'

                                import re
                                update_query = """UPDATE {} SET "{}"='Reconciled' FROM {} WHERE {};""".format(
                                        actual_table,
                                        "recon_status_" + str(source_no),
                                        specific_recon,
                                        specific_rule[:-4]
                                    )
                                source_no += 1


                                if update_query[-2] == ';':
                                    update_query = update_query[:-1]
                                # print(update_query, '\n')
                                con.execute(update_query)

                    ###################################################### PROBABLE MATCH RULE QUERYING ###############################################

                    update_query = """UPDATE {} SET "overall_probable_status"='Reconciled' FROM {}, {} WHERE {};""".format(
                        source1_name,
                        source2_name,
                        source3_name,
                        probable_match_rule
                    )
                    con.execute(update_query)

                    update_query = """UPDATE {} SET "overall_probable_status"='Reconciled' FROM {}, {} WHERE {};""".format(
                        source2_name,
                        source1_name,
                        source3_name,
                        probable_match_rule
                    )
                    con.execute(update_query)

                    update_query = """UPDATE {} SET "overall_probable_status"='Reconciled' FROM {}, {} WHERE {};""".format(
                        source3_name,
                        source1_name,
                        source2_name,
                        probable_match_rule
                    )
                    con.execute(update_query)

                    probable_match_rule = [element.rstrip().replace('\n','').replace('\t','') for element in probable_match_rule.split('AND')]

                    for i in range(len(source_list)):
                        source_no = 1
                        for j in range(len(source_list)):
                            if i != j:
                                actual_table = source_list[i]
                                specific_probable = source_list[j]

                                specific_rule = ""
                                for k in probable_match_rule:
                                    if actual_table in k and specific_probable in k:
                                        specific_rule += k + ' AND'

                                import re
                                update_query = """UPDATE {} SET "{}"='Reconciled' FROM {} WHERE {};""".format(
                                        actual_table,
                                        "probable_recon_status_" + str(source_no),
                                        specific_probable,
                                        specific_rule[:-4]
                                    )
                                # print(i+1, j+1, source_no, '\n')
                                source_no += 1


                                if update_query[-2] == ';':
                                    update_query = update_query[:-1]
                                # print(update_query, '\n')
                                con.execute(update_query)

                    
                    ################################# DISPUTE 3 WAY #########################################################

                    from sqlalchemy.orm import sessionmaker
                    Session = sessionmaker(bind=engine)
                    Session.configure(bind=engine) 
                    session = Session()

                    for i in range(len(source_list)):

                        class Tbl_details(Base):
                            __table__ = Table(source_list[i], Base.metadata,
                                            autoload=True, autoload_with=engine)

                        class Tbl_dispute_details(Base):
                            __table__ = Table(source_dispute_list[i], Base.metadata,
                                            autoload=True, autoload_with=engine)

                        tbl_details = Tbl_details()

                        rows = session.query(Tbl_details).all()

                        for each_row in rows:
                            tbl_details_dict = each_row.__dict__
                            for key in tbl_details_dict.copy():
                                if key == '_sa_instance_state':
                                    del tbl_details_dict[key]
                            tbl_details_dict['action'] = 'Not Initiated'
                            if tbl_details_dict['overall_recon_status'] == 'Not Reconciled':
                                tbl_dispute_details = Tbl_dispute_details()
                                tbl_dispute_details.__dict__.update(tbl_details_dict)
                                session.add(tbl_dispute_details)

                        session.commit()

                    con.close()
                    con = engine.connect()

                    ################################### ALTER TABLE COLUMN NAMES #############################################
                    for i in range(len(source_list)):
                        source_no = 1
                        for j in range(len(source_list)):
                            if i != j:
                                source_no += 1
                                update_query = """alter table {} rename recon_status_{} to recon_status_{}_to_{};""".format(
                                                source_list[i],
                                                source_no-1,
                                                str(i+1),
                                                str(j+1)
                                )
                                # print(update_query)
                                con.execute(update_query)

                                update_query = """alter table {} rename recon_status_{} to recon_status_{}_to_{};""".format(
                                                source_dispute_list[i],
                                                source_no-1,
                                                str(i+1),
                                                str(j+1)
                                )
                                # print(update_query)
                                con.execute(update_query)

                                update_query = """alter table {} rename probable_recon_status_{} to probable_recon_status_{}_to_{};""".format(
                                                source_list[i],
                                                source_no-1,
                                                str(i+1),
                                                str(j+1)
                                )
                                # print(update_query)
                                con.execute(update_query)

                                update_query = """alter table {} rename probable_recon_status_{} to probable_recon_status_{}_to_{};""".format(
                                                source_dispute_list[i],
                                                source_no-1,
                                                str(i+1),
                                                str(j+1)
                                )
                                # print(update_query)
                                con.execute(update_query)
                    
                ############################################### FOUR WAY ####################################################################

                if source_details[0][0] and source_details[0][1] and source_details[0][2] and source_details[0][3] and recon_type[0][0] == 'Four-way':
                    source_names = []*4
                    for i in range(4):
                        source_name_query = con.execute("""SELECT source_name FROM public.portal_tbl_source_mst where id = """ + str(source_details[0][i]) + """;""")
                        source_name_query = list(source_name_query)
                        source_names.append(source_name_query[0][0])

                    source1_name = 'tbl_' + source_names[0] + '_details'
                    source2_name = 'tbl_' + source_names[1] + '_details'
                    source3_name = 'tbl_' + source_names[2] + '_details'
                    source4_name = 'tbl_' + source_names[3] + '_details'

                    source1_dispute_name = 'tbl_' + source_names[0] + '_dispute_details'
                    source2_dispute_name = 'tbl_' + source_names[1] + '_dispute_details'
                    source3_dispute_name = 'tbl_' + source_names[2] + '_dispute_details'
                    source4_dispute_name = 'tbl_' + source_names[3] + '_dispute_details'

                    source_list = [source1_name, source2_name, source3_name, source4_name]
                    source_dispute_list = [source1_dispute_name, source2_dispute_name, source3_dispute_name, source4_dispute_name]

                    recon_rule = source_details[0][4]
                    probable_match_rule = source_details[0][5]

                    ###################################################### RECON RULE QUERYING ###############################################

                    update_query = """UPDATE {} SET "overall_recon_status"='Reconciled' FROM {}, {}, {} WHERE {};""".format(
                        source1_name,
                        source2_name,
                        source3_name,
                        source4_name,
                        recon_rule
                    )
                    con.execute(update_query)
                    # print(update_query)

                    update_query = """UPDATE {} SET "overall_recon_status"='Reconciled' FROM {}, {}, {} WHERE {};""".format(
                        source2_name,
                        source1_name,
                        source3_name,
                        source4_name,
                        recon_rule
                    )
                    con.execute(update_query)

                    update_query = """UPDATE {} SET "overall_recon_status"='Reconciled' FROM {}, {}, {} WHERE {};""".format(
                        source3_name,
                        source1_name,
                        source2_name,
                        source4_name,
                        recon_rule
                    )
                    con.execute(update_query)

                    update_query = """UPDATE {} SET "overall_recon_status"='Reconciled' FROM {}, {}, {} WHERE {};""".format(
                        source4_name,
                        source1_name,
                        source2_name,
                        source3_name,
                        recon_rule
                    )
                    con.execute(update_query)
                    # print(update_query)

                    recon_rule = [element.rstrip().replace('\n','').replace('\t','') for element in recon_rule.split('AND')]

                    for i in range(len(source_list)):
                        source_no = 1
                        for j in range(len(source_list)):
                            if i != j:
                                # print(i+1, j+1, source_no, '\n')
                                actual_table = source_list[i]
                                specific_recon = source_list[j]

                                specific_rule = ""
                                for k in recon_rule:
                                    if actual_table in k and specific_recon in k:
                                        specific_rule += k + ' AND'

                                import re
                                update_query = """UPDATE {} SET "{}"='Reconciled' FROM {} WHERE {};""".format(
                                        actual_table,
                                        "recon_status_" + str(source_no),
                                        specific_recon,
                                        specific_rule[:-4]
                                    )
                                source_no += 1


                                if update_query[-2] == ';':
                                    update_query = update_query[:-1]
                                # print(update_query, '\n')
                                con.execute(update_query)

                    ###################################################### PROBABLE MATCH RULE QUERYING ###############################################

                    update_query = """UPDATE {} SET "overall_probable_status"='Reconciled' FROM {}, {}, {} WHERE {};""".format(
                        source1_name,
                        source2_name,
                        source3_name,
                        source4_name,
                        probable_match_rule
                    )
                    con.execute(update_query)

                    update_query = """UPDATE {} SET "overall_probable_status"='Reconciled' FROM {}, {}, {} WHERE {};""".format(
                        source2_name,
                        source1_name,
                        source3_name,
                        source4_name,
                        probable_match_rule
                    )
                    con.execute(update_query)

                    update_query = """UPDATE {} SET "overall_probable_status"='Reconciled' FROM {}, {}, {} WHERE {};""".format(
                        source3_name,
                        source1_name,
                        source2_name,
                        source4_name,
                        probable_match_rule
                    )
                    con.execute(update_query)

                    update_query = """UPDATE {} SET "overall_probable_status"='Reconciled' FROM {}, {}, {} WHERE {};""".format(
                        source4_name,
                        source1_name,
                        source2_name,
                        source3_name,
                        probable_match_rule
                    )
                    con.execute(update_query)
                    # print(update_query)

                    probable_match_rule = [element.rstrip().replace('\n','').replace('\t','') for element in probable_match_rule.split('AND')]

                    for i in range(len(source_list)):
                        source_no = 1
                        for j in range(len(source_list)):
                            if i != j:
                                actual_table = source_list[i]
                                specific_probable = source_list[j]

                                specific_rule = ""
                                for k in probable_match_rule:
                                    if actual_table in k and specific_probable in k:
                                        specific_rule += k + ' AND'

                                import re
                                update_query = """UPDATE {} SET "{}"='Reconciled' FROM {} WHERE {};""".format(
                                        actual_table,
                                        "probable_recon_status_" + str(source_no),
                                        specific_probable,
                                        specific_rule[:-4]
                                    )
                                # print(i+1, j+1, source_no, '\n')
                                source_no += 1


                                if update_query[-2] == ';':
                                    update_query = update_query[:-1]
                                # print(update_query, '\n')
                                con.execute(update_query)

                    ######################################### DISPUTE 4 WAY #########################################################

                    from sqlalchemy.orm import sessionmaker
                    Session = sessionmaker(bind=engine)
                    Session.configure(bind=engine) 
                    session = Session()

                    for i in range(len(source_list)):

                        class Tbl_details(Base):
                            __table__ = Table(source_list[i], Base.metadata,
                                            autoload=True, autoload_with=engine)

                        class Tbl_dispute_details(Base):
                            __table__ = Table(source_dispute_list[i], Base.metadata,
                                            autoload=True, autoload_with=engine)

                        tbl_details = Tbl_details()

                        rows = session.query(Tbl_details).order_by(Tbl_details.details_id).all()

                        auto_inc = 1
                        for each_row in rows:
                            tbl_details_dict = each_row.__dict__
                            for key in tbl_details_dict.copy():
                                if key == '_sa_instance_state':
                                    del tbl_details_dict[key]
                            tbl_details_dict['action'] = 'Not Initiated'
                            if tbl_details_dict['overall_recon_status'] == 'Not Reconciled':
                                for key in tbl_details_dict.copy():
                                    if key == 'details_id':
                                        details_ref_id = tbl_details_dict['details_id']
                                        tbl_details_dict['details_ref_id'] = details_ref_id
                                        tbl_details_dict['dispute_id'] = auto_inc
                                        auto_inc += 1
                                        del tbl_details_dict[key]
                                tbl_dispute_details = Tbl_dispute_details()
                                tbl_dispute_details.__dict__.update(tbl_details_dict)
                                session.add(tbl_dispute_details)
                        session.commit()
                    
                    con.close()
                    con = engine.connect()
                    
                    ################################### ALTER TABLE COLUMN NAMES #############################################
                    for i in range(len(source_list)):
                        source_no = 1
                        for j in range(len(source_list)):
                            if i != j:
                                source_no += 1
                                update_query = """alter table {} rename recon_status_{} to recon_status_{}_to_{};""".format(
                                                source_list[i],
                                                source_no-1,
                                                str(i+1),
                                                str(j+1)
                                )
                                # print(update_query)
                                con.execute(update_query)

                                update_query = """alter table {} rename recon_status_{} to recon_status_{}_to_{};""".format(
                                                source_dispute_list[i],
                                                source_no-1,
                                                str(i+1),
                                                str(j+1)
                                )
                                # print(update_query)
                                con.execute(update_query)

                                update_query = """alter table {} rename probable_recon_status_{} to probable_recon_status_{}_to_{};""".format(
                                                source_list[i],
                                                source_no-1,
                                                str(i+1),
                                                str(j+1)
                                )
                                # print(update_query)
                                con.execute(update_query)

                                update_query = """alter table {} rename probable_recon_status_{} to probable_recon_status_{}_to_{};""".format(
                                                source_dispute_list[i],
                                                source_no-1,
                                                str(i+1),
                                                str(j+1)
                                )
                                # print(update_query)
                                con.execute(update_query)
                    
        con.close()
    return JsonResponse({"Success":True})

class tbl_reconcilation_process_mst_view(viewsets.ModelViewSet):
    serializer_class = tbl_reconcilation_process_mst_serializer
    queryset = tbl_reconcilation_process_mst.objects.filter(is_deleted='N')

# Schedule Batch
class tbl_schedule_process_mst_view(viewsets.ModelViewSet):
    serializer_class = tbl_schedule_process_mst_serializer
    queryset = tbl_schedule_process_mst.objects.filter(is_deleted='N')    

# Action- workflow
# class tbl_workflow_action_mst_view(viewsets.ModelViewSet):
#     serializer_class = tbl_workflow_action_mst_serializer
#     queryset = tbl_workflow_action_mst.objects.filter(is_deleted='N')

# Dispute Resolution

class tbl_role_mst_view(viewsets.ModelViewSet):
    serializer_class = tbl_role_mst_serializer
    queryset = Tbl_Role_Mst.objects.filter(is_deleted='N')

class accesstablenames(APIView):
    def get(self, request): 
        cursor = connection.cursor()
        cursor.execute("""SELECT table_name FROM information_schema.tables
                            WHERE table_schema = 'public'
                            ORDER BY table_name
                        """)
        tablenames = dictfetchall(cursor)
        return Response(tablenames, status=status.HTTP_201_CREATED)

class accessfieldname(APIView):
    def post(self, request):
        data = request.body.decode('utf-8')
        cursor = connection.cursor()
        cursor.execute("SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = %s",[data])
        fieldnames = dictfetchall(cursor)
        return Response(fieldnames, status=status.HTTP_201_CREATED)        

# Dispute Resolution
# get_dispute_source_data
@csrf_exempt
def get_dispute_source_data(request):
    if request.method == "POST":
        tablesNames = json.loads(request.body)
        rowDataofSourceTables = []
        rowDataofDisputeTables = []

        for data in tablesNames['sourceTables']:
            selectQuery = "select count(*) from " + data
            cursor = connection.cursor()
            cursor.execute(selectQuery)
            row = cursor.fetchone()
            rowDataofSourceTables.append({data.replace('tbl_','').replace('_details',''): row})

        for data in tablesNames['disputeSourceTables']:
            selectQuery = "select count(*) from " + data + " WHERE overall_recon_status='Not Reconciled'"
            cursor = connection.cursor()
            cursor.execute(selectQuery)
            result = cursor.fetchall()
            rowDataofDisputeTables.append({data.replace('tbl_','').replace('_dispute_details',''): result})
            
        selectQuery = tablesNames['selectSql']
        print(selectQuery,'sssssssssssss')
        cursor = connection.cursor()
        cursor.execute(selectQuery)
        dataRows = cursor.fetchall()

        return JsonResponse({"sourceResult": rowDataofSourceTables, "disputeSourceResult": rowDataofDisputeTables, "dataRows": dataRows, "Success": True})

class update_disputed_records(APIView):
    def post(self, request):
        requestData = json.loads(request.body)
        recordsToBeReconciled = requestData['recordsToBeReconciled']
        fieldsTobeUpdated = requestData['fieldsTobeUpdated']
        cursor = connection.cursor()

        for key, value in recordsToBeReconciled.items():
            updateQueryData = key.split('-')
            reconStatus = 'Reconciled'
            if int(updateQueryData[2]) != requestData['COMPANY_ID']:
                reconStatus = 'Recommended'
            updateQuery = "UPDATE tbl_" + updateQueryData[0] + "_dispute_details SET overall_recon_status='" + reconStatus + "', overall_probable_status='" + reconStatus + "' WHERE details_ref_id IN (" + ','.join(value) + ')'
            updateQuery1 = "UPDATE tbl_" + updateQueryData[0] + "_details SET overall_recon_status='" + reconStatus + "', overall_probable_status='" + reconStatus + "' WHERE details_id IN (" + ','.join(value) + ')'
            cursor.execute(updateQuery)
            cursor.execute(updateQuery1)

        for key, value in recordsToBeReconciled.items():
            updateQueryData = key.split('-')
            reconStatus = 'Reconciled'
            if int(updateQueryData[2]) != requestData['COMPANY_ID']:
                reconStatus = 'Recommended'
            reconciliationType = len(recordsToBeReconciled)
            subUpdateQuery = ''
            for typeId in range(reconciliationType):
                typeId += 1
                if typeId != int(updateQueryData[1]):
                    subUpdateQuery += "recon_status_" + updateQueryData[1] + "_to_" + str(typeId) + "='" + reconStatus + "',"
            subUpdateQuery = subUpdateQuery[:-1]
            updateQuery = "UPDATE tbl_" + updateQueryData[0] + "_dispute_details SET " + subUpdateQuery + " WHERE details_ref_id IN (" + ','.join(value) + ')'
            updateQuery1 = "UPDATE tbl_" + updateQueryData[0] + "_details SET " + subUpdateQuery + " WHERE details_id IN (" + ','.join(value) + ')'
            cursor.execute(updateQuery)
            cursor.execute(updateQuery1)

        for key, value in fieldsTobeUpdated.items():
            updateQueryData = key.split('-')
            updateQuery = "UPDATE tbl_" + updateQueryData[0] + "_dispute_details SET " + updateQueryData[1] + "=" + value + " WHERE details_ref_id =" + updateQueryData[2]
            updateQuery1 = "UPDATE tbl_" + updateQueryData[0] + "_details SET " + updateQueryData[1] + "=" + value + " WHERE details_id =" + updateQueryData[2]
            cursor.execute(updateQuery)
            cursor.execute(updateQuery1)

        return Response(1, status=status.HTTP_201_CREATED)

class tbl_workflow_mst_view(viewsets.ModelViewSet):
    serializer_class = tbl_workflow_mst_serializer
    queryset = tbl_workflow_mst.objects.filter(is_deleted='N')         

class GeneralViewSet(viewsets.ModelViewSet):
    @property
    def model(self):
        return apps.get_model(app_label=str(self.kwargs['app_label']), model_name=str(self.kwargs['model_name']))

    def get_queryset(self):
        model = self.model
        return model.objects.all()[:1]           

    def get_serializer_class(self):
        GeneralSerializer.Meta.model = self.model
        return GeneralSerializer