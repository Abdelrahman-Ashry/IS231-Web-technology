"""
URL configuration for onlinelibrary project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Fixed: Changed admin_urls to urls
    path('admin/', admin.site.urls),
    
    # App routing
    path('register/', include('register.urls')),
    path('library/', include('library.urls')), 
    
    # Sets library as the homepage
    path('', include('library.urls')),         
]

# Serving media and static files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)