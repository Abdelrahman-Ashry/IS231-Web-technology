from django.db import models

CATEGORY_CHOICES = [
    ('Fiction', 'Fiction'),
    ('Non-Fiction', 'Non-Fiction'),
    ('Science', 'Science'),
    ('Education', 'Education'),
    ('Technology', 'Technology'),
    ('History', 'History'),
    ('Self-Development', 'Self-Development'),
    ('Philosophy', 'Philosophy'),
    ('Religion', 'Religion'),
    ("Children's Books", "Children's Books"),
]

STATUS_CHOICES = [
    ('Available', 'Available'),
    ('Borrowed', 'Borrowed'),
    ('Reserved', 'Reserved'),
    ('Out of Stock', 'Out of Stock'),
]

class Book(models.Model):
    isbn        = models.CharField(max_length=30, unique=True)
    title       = models.CharField(max_length=200)
    author      = models.CharField(max_length=200)
    publisher   = models.CharField(max_length=200, blank=True, default='')
    year        = models.IntegerField()
    copies      = models.IntegerField(default=0)
    category    = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    status      = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Available')
    description = models.TextField(blank=True, default='')
    cover       = models.ImageField(upload_to='book_covers/', blank=True, null=True)
    is_deleted  = models.BooleanField(default=False)
    deleted_at  = models.DateTimeField(null=True, blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    @property
    def cover_url(self):
        if self.cover:
            return self.cover.url
        return '/static/img/default-cover.jpg'
    

from django.conf import settings

class BorrowRecord(models.Model):
    user        = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    book        = models.ForeignKey(Book, on_delete=models.CASCADE)
    quantity    = models.IntegerField(default=1)
    borrow_date = models.DateField()
    return_date = models.DateField()
    address     = models.TextField()
    payment     = models.CharField(max_length=20)
    notes       = models.TextField(blank=True, default='')
    newspaper   = models.BooleanField(default=False)
    created_at  = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} borrowed {self.book.title}"