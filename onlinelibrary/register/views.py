from django.shortcuts import redirect, render
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.core.mail import send_mail
from django.conf import settings
import uuid
from .models import User


def login_view(request):
    if request.user.is_authenticated:
        if request.user.is_admin:
            return redirect('register:login')   # change to admin dashboard URL when ready
        return redirect('register:login')       # change to user dashboard URL when ready

    if request.method == 'POST':
        email    = request.POST.get('username')
        password = request.POST.get('password')

        try:
            user_obj = User.objects.get(email=email)
            user = authenticate(request, username=user_obj.username, password=password)
        except User.DoesNotExist:
            user = None

        if user is not None:
            if not user.is_active:
                messages.error(request, 'Please verify your email before logging in.')
                return render(request, 'register/login.html')
            login(request, user)
            if user.is_admin:
                return redirect('register:login')   # change to admin dashboard URL when ready
            return redirect('register:login')       # change to user dashboard URL when ready
        else:
            messages.error(request, 'Invalid email or password.')

    return render(request, 'register/login.html')


def register_view(request):
    if request.user.is_authenticated:
        return redirect('register:login')

    if request.method == 'POST':
        fullname  = request.POST.get('fullname', '').strip()
        email     = request.POST.get('email', '').strip()
        password  = request.POST.get('psw', '')
        confirm   = request.POST.get('confirm-psw', '')
        role      = request.POST.get('is_admin', 'user')

        if password != confirm:
            messages.error(request, 'Passwords do not match.')
            return render(request, 'register/sign up.html')

        if User.objects.filter(email=email).exists():
            messages.error(request, 'An account with this email already exists.')
            return render(request, 'register/sign up.html')

        name_parts = fullname.split(' ', 1)
        first_name = name_parts[0]
        last_name  = name_parts[1] if len(name_parts) > 1 else ''

        # create user but inactive until email verified
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            is_admin=(role == 'admin'),
            is_active=False,
        )

        # generate token and send verification email
        token = str(uuid.uuid4())
        request.session['verification_token'] = token
        request.session['verification_user_id'] = user.id

        verification_link = f"http://127.0.0.1:8000/register/verify/{token}/"
        send_mail(
            subject='Verify your Online Library account',
            message=f'Hi {first_name},\n\nClick the link below to verify your email:\n\n{verification_link}\n\nThis link expires when you close your browser.',
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
        )

        messages.success(request, 'Account created! Please check your email to verify your account.')
        return render(request, 'register/sign up.html')

    return render(request, 'register/sign up.html')


def verify_email_view(request, token):
    session_token = request.session.get('verification_token')
    user_id = request.session.get('verification_user_id')

    if token == session_token and user_id:
        try:
            user = User.objects.get(id=user_id)
            user.is_active = True
            user.save()
            login(request, user)
            messages.success(request, 'Email verified! Welcome to the Online Library!')
            if user.is_admin:
                return redirect('register:login')   # change to admin dashboard URL when ready
            return redirect('register:login')       # change to user dashboard URL when ready
        except User.DoesNotExist:
            pass

    messages.error(request, 'Invalid or expired verification link.')
    return redirect('register:sign-up')


def logout_view(request):
    logout(request)
    return redirect('register:login')