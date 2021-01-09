from django.urls import include, path
from ntpath import basename
from rest_framework import routers
from . import views
from drf_jwt_2fa.views import obtain_auth_token, obtain_code_token, refresh_auth_token
from django.urls.conf import re_path
 
router = routers.DefaultRouter()
router.register(r'country', views.CountryViewSet)
router.register(r'state', views.StateViewSet, basename='state')
router.register(r'city', views.CityViewSet, basename='city')
router.register(r'location', views.LocationViewSet, basename='location')
router.register(r'term', views.TermViewSet, basename = 'term')
router.register(r'company', views.CompanyViewSet, basename = 'company')
router.register(r'user', views.UserViewSet, basename='user')
router.register(r'login', views.tbl_login_mst_view, basename='login')
router.register(r'master', views.MasterViewSet, basename='master')
router.register(r'srcmaster', views.tbl_source_mst_view)
router.register(r'srcdetails', views.tbl_source_details_view)
router.register(r'reconmst', views.tbl_reconcilation_definition_mst_view)
router.register(r'recondet', views.tbl_reconcilation_definition_details_view)
router.register(r'uom', views.UOMViewSet)
router.register(r'currency', views.CurrencyViewSet)
router.register(r'reason', views.tbl_reason_mst_view)
router.register(r'channel', views.ChannelViewset, basename='channel')
router.register(r'source', views.tbl_source_mst_view, basename='source')
router.register(r'apimaster', views.tbl_api_definition_mst_view)
router.register(r'apidetails', views.tbl_api_definition_details_view)
router.register(r'standardapimaster', views.tbl_api_definition_standard_mst_view)
router.register(r'standardapidetails', views.tbl_api_definition_standard_details_view)
router.register(r'reconProcessDetails', views.tbl_reconcilation_process_details_view)
router.register(r'reconProcessMaster', views.tbl_reconcilation_process_mst_view)
router.register(r'scheduleBatchMst', views.tbl_schedule_process_mst_view)
router.register(r'sourcetableFieldsMst', views.tbl_sourcetable_fields_mst_view)
#router.register(r'actionMst', views.tbl_workflow_action_mst_view)
router.register(r'roleMst', views.tbl_role_mst_view)
router.register(r'transactiontypemst', views.tbl_transaction_type_mst_view)
router.register(r'employee', views.EmployeeViewSet)
router.register(r'workflowmst', views.tbl_workflow_mst_view)
router.register(r'activity', views.ActivityViewSet)
router.register(r'left-panel', views.LeftPanelViewSet)
router.register(r'level', views.LevelViewSet)
router.register(r'level-details', views.LevelDetailsViewSet)
router.register(r'action', views.ActionViewSet)
router.register(r'workflow', views.WorkflowViewSet)

urlpatterns = [
    path('auth/code/', obtain_code_token),
    path('auth/login/', obtain_auth_token),
    path('auth/refresh-token/', refresh_auth_token),
    re_path('currency/ofcountry/(?P<country_id>.+)/$', views.CurrencyViewSet.as_view({'get': 'list'})),  #Using only one viewset pass country_id
    re_path('master/oftype/(?P<master_type>.+)/$', views.MasterViewSet.as_view({'get' : 'list'})),  #Using only one viewset pass country_id
    path(r'source/dynamic',views.dynamic_table,name='dynamic'), #this is for creating dynamic tables
    path(r'reconProcessMaster/run_reconciliation',views.run_reconciliation,name='runreconciliation'),
    path(r'reconProcessMaster/load_data',views.load_data,name='loaddata'),
    path(r'sourceNameTables',views.get_dispute_source_data),
    path(r'accesstablenames/', views.accesstablenames.as_view(), name="accesstablenames"),
    path(r'accesstablefieldname/', views.accessfieldname.as_view(), name="accesstablefieldname"),
    path(r'updateDisputedRecords', views.update_disputed_records.as_view(), name="updateDisputedRecords"),
    path(r'general_mst_label/<app_label>/<model_name>', views.GeneralViewSet.as_view({'get': 'list'})),
    path('', include(router.urls)),
]
