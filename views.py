from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.http import HttpResponseRedirect

def index(request):
    return render(request, 'index.html')

def login_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            # ✅ SUPERUSER → ADMIN DASHBOARD
            if user.is_superuser:
                return HttpResponseRedirect('/admin-dashboard/')
            # ✅ RESIDENT → RESIDENT DASHBOARD
            else:
                return HttpResponseRedirect('/resident_dashboard/')
        else:
            messages.error(request, "❌ Wrong username or password")
    
    return render(request, 'login.html')

def admin_dashboard(request):
    # 🔒 SECURITY: Only logged-in superusers can access
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/login/')
    if not request.user.is_superuser:
        messages.error(request, "⚠️ Access denied. Admin only.")
        return HttpResponseRedirect('/')
    
    return render(request, 'admin_dashboard.html')

def logout_view(request):
    logout(request)
    messages.success(request, "✅ You have been logged out successfully.")
    return HttpResponseRedirect('/login/')

from django.shortcuts import render, redirect
from django.contrib import messages
from django.http import HttpResponseRedirect
import os
from django.conf import settings
from datetime import datetime

def resident_dashboard(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/login/')
    
    if request.method == "POST":
        full_name = request.POST.get("full_name")
        contact_number = request.POST.get("contact_number")
        address = request.POST.get("address")
        complaint_type = request.POST.get("complaint_type")
        description = request.POST.get("description")
        photo = request.FILES.get("photo")
        
        if not photo:
            messages.error(request, "⚠️ Please upload a photo.")
            return render(request, 'resident_dashboard.html')
        
        import os
        from django.conf import settings
        from datetime import datetime
        
        upload_dir = os.path.join(settings.MEDIA_ROOT, 'complaint_photos')
        os.makedirs(upload_dir, exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{timestamp}_{photo.name}"
        file_path = os.path.join(upload_dir, filename)
        
        with open(file_path, 'wb+') as destination:
            for chunk in photo.chunks():
                destination.write(chunk)
        
        messages.success(request, "COMPLAINT_SUBMITTED")
        return render(request, 'resident_dashboard.html')
    
    return render(request, 'resident_dashboard.html')