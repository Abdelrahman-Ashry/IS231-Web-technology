from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from django.views.decorators.http import require_POST
from .models import Book, CATEGORY_CHOICES, STATUS_CHOICES


def admin_required(view_func):
    @login_required(login_url='/register/login/')
    def wrapper(request, *args, **kwargs):
        if not request.user.is_admin:
            return redirect('library:user_dashboard')
        return view_func(request, *args, **kwargs)
    return wrapper


@admin_required
def admin_dashboard(request):
    books         = Book.objects.filter(is_deleted=False).order_by('-created_at')
    deleted_books = Book.objects.filter(is_deleted=True).order_by('-deleted_at')
    return render(request, 'library/admin_dashboard.html', {
        'books':         books,
        'deleted_books': deleted_books,
    })


@admin_required
def add_book(request):
    if request.method == 'POST':
        isbn        = request.POST.get('isbn', '').strip()
        title       = request.POST.get('title', '').strip()
        author      = request.POST.get('author', '').strip()
        publisher   = request.POST.get('publisher', '').strip()
        year        = request.POST.get('year')
        copies      = request.POST.get('copies', 0)
        category    = request.POST.get('category', '')
        status      = request.POST.get('status', 'Available')
        description = request.POST.get('description', '').strip()
        cover       = request.FILES.get('cover')

        errors = []
        if not isbn:
            errors.append('ISBN is required.')
        elif Book.objects.filter(isbn=isbn).exists():
            errors.append('A book with this ISBN already exists.')
        if not title:
            errors.append('Title is required.')
        if not author:
            errors.append('Author is required.')
        try:
            year = int(year)
            if year < 1000 or year > 2026:
                errors.append('Year must be between 1000 and 2026.')
        except (TypeError, ValueError):
            errors.append('Enter a valid year.')
        try:
            copies = int(copies)
            if copies < 0:
                errors.append('Copies cannot be negative.')
        except (TypeError, ValueError):
            errors.append('Enter a valid number of copies.')

        if errors:
            return render(request, 'library/add_book.html', {
                'errors':     errors,
                'categories': CATEGORY_CHOICES,
                'statuses':   STATUS_CHOICES,
                'form_data':  request.POST,
            })

        Book.objects.create(
            isbn=isbn, title=title, author=author, publisher=publisher,
            year=year, copies=copies, category=category,
            status=status, description=description,
            cover=cover if cover else None,
        )
        return redirect('library:admin_dashboard')

    return render(request, 'library/add_book.html', {
        'categories': CATEGORY_CHOICES,
        'statuses':   STATUS_CHOICES,
    })


@admin_required
def edit_book(request, book_id):
    book = get_object_or_404(Book, id=book_id, is_deleted=False)

    if request.method == 'POST':
        title       = request.POST.get('title', '').strip()
        author      = request.POST.get('author', '').strip()
        publisher   = request.POST.get('publisher', '').strip()
        year        = request.POST.get('year')
        copies      = request.POST.get('copies', 0)
        category    = request.POST.get('category', '')
        status      = request.POST.get('status', 'Available')
        description = request.POST.get('description', '').strip()
        cover       = request.FILES.get('cover')
        delete_cover = request.POST.get('delete_cover')

        errors = []
        if not title:
            errors.append('Title is required.')
        if not author:
            errors.append('Author is required.')
        try:
            year = int(year)
            if year < 1000 or year > 2026:
                errors.append('Year must be between 1000 and 2026.')
        except (TypeError, ValueError):
            errors.append('Enter a valid year.')
        try:
            copies = int(copies)
            if copies < 0:
                errors.append('Copies cannot be negative.')
        except (TypeError, ValueError):
            errors.append('Enter a valid number of copies.')

        if errors:
            return render(request, 'library/edit_book.html', {
                'book':       book,
                'errors':     errors,
                'categories': CATEGORY_CHOICES,
                'statuses':   STATUS_CHOICES,
            })

        book.title       = title
        book.author      = author
        book.publisher   = publisher
        book.year        = year
        book.copies      = copies
        book.category    = category
        book.status      = status
        book.description = description

        if delete_cover:
            book.cover = None
        elif cover:
            book.cover = cover

        book.save()
        return redirect('library:admin_dashboard')

    return render(request, 'library/edit_book.html', {
        'book':       book,
        'categories': CATEGORY_CHOICES,
        'statuses':   STATUS_CHOICES,
    })


@admin_required
@require_POST
def delete_book(request, book_id):
    book = get_object_or_404(Book, id=book_id, is_deleted=False)
    book.is_deleted = True
    book.deleted_at = timezone.now()
    book.save()
    return redirect('library:admin_dashboard')


@admin_required
@require_POST
def restore_book(request, book_id):
    book = get_object_or_404(Book, id=book_id, is_deleted=True)
    book.is_deleted = False
    book.deleted_at = None
    book.save()
    return redirect('library:admin_dashboard')


@admin_required
@require_POST
def permanent_delete_book(request, book_id):
    book = get_object_or_404(Book, id=book_id, is_deleted=True)
    book.delete()
    return redirect('library:admin_dashboard')

@login_required(login_url='/register/login/')
def user_dashboard(request):
    books = Book.objects.filter(is_deleted=False).order_by('-created_at')
    
    # Search
    query    = request.GET.get('q', '')
    category = request.GET.get('category', '')
    
    if query:
        books = books.filter(title__icontains=query) | books.filter(author__icontains=query)
    if category:
        books = books.filter(category=category)
    
    return render(request, 'library/user_dashboard.html', {
        'books':      books,
        'query':      query,
        'category':   category,
        'categories': CATEGORY_CHOICES,
    })

@login_required(login_url='/register/login/')
def book_details(request, book_id):
    book = get_object_or_404(Book, id=book_id, is_deleted=False)
    return render(request, 'library/book_details.html', {'book': book})

from .models import Book, BorrowRecord, CATEGORY_CHOICES, STATUS_CHOICES
from datetime import date

@login_required(login_url='/register/login/')
def borrow_book(request, book_id):
    book = get_object_or_404(Book, id=book_id, is_deleted=False)

    if request.method == 'POST':
        quantity    = request.POST.get('quantity', 1)
        borrow_date = request.POST.get('borrow_date')
        return_date = request.POST.get('return_date')
        address     = request.POST.get('address', '').strip()
        payment     = request.POST.get('payment', '')
        notes       = request.POST.get('notes', '').strip()
        newspaper   = request.POST.get('newspaper') == 'on'

        errors = []
        try:
            quantity = int(quantity)
            if quantity < 1 or quantity > book.copies:
                errors.append(f'Quantity must be between 1 and {book.copies}.')
        except (TypeError, ValueError):
            errors.append('Enter a valid quantity.')

        if not borrow_date or not return_date:
            errors.append('Please select both dates.')
        else:
            from datetime import datetime
            borrow = date.fromisoformat(borrow_date)
            ret    = date.fromisoformat(return_date)
            if borrow < date.today():
                errors.append('Borrow date cannot be in the past.')
            if ret <= borrow:
                errors.append('Return date must be after borrow date.')

        if not address:
            errors.append('Address is required.')
        if not payment:
            errors.append('Please select a payment method.')

        if errors:
            return render(request, 'library/borrow_book.html', {
                'book': book, 'errors': errors
            })

        # Save borrow record
        BorrowRecord.objects.create(
            user=request.user,
            book=book,
            quantity=quantity,
            borrow_date=borrow_date,
            return_date=return_date,
            address=address,
            payment=payment,
            notes=notes,
            newspaper=newspaper,
        )

        # Reduce copies
        book.copies -= quantity
        if book.copies == 0:
            book.status = 'Borrowed'
        book.save()

        return redirect('library:my_borrowed')

    return render(request, 'library/borrow_book.html', {'book': book})


@login_required(login_url='/register/login/')
def my_borrowed(request):
    borrowed = BorrowRecord.objects.filter(user=request.user).order_by('-created_at')
    return render(request, 'library/my_borrowed.html', {'borrowed': borrowed})