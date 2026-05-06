from django.urls import path
from . import views

app_name = 'register'

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('sign-up/', views.register_view, name='sign-up'),
    path('logout/', views.logout_view, name='logout'),
    path('verify/<str:token>/', views.verify_email_view, name='verify-email'),
]