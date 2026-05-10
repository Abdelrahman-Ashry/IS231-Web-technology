from django.urls import path
from . import views

app_name = 'library'

urlpatterns = [
    path('admin-dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('add-book/', views.add_book, name='add_book'),
    path('edit-book/<int:book_id>/', views.edit_book, name='edit_book'),
    path('delete-book/<int:book_id>/', views.delete_book, name='delete_book'),
    path('restore-book/<int:book_id>/', views.restore_book, name='restore_book'),
    path('permanent-delete/<int:book_id>/', views.permanent_delete_book, name='permanent_delete_book'),
    path('user-dashboard/', views.user_dashboard, name='user_dashboard'),
    path('book/<int:book_id>/', views.book_details, name='book_details'),
    path('borrow/<int:book_id>/', views.borrow_book, name='borrow_book'),
    path('my-borrowed/', views.my_borrowed, name='my_borrowed'),
]