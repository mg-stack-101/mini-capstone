let photoUploaded = false;

function previewImage(event) {
    const input = event.target;
    const preview = document.getElementById('photo-preview');
    const img = document.getElementById('preview-img');
    const note = document.getElementById('photo-note');
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            img.src = e.target.result;
            preview.style.display = 'block';
            note.style.display = 'none';
            photoUploaded = true;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function showSuccessMessage() {
    const overlay = document.getElementById('overlay');
    const successMsg = document.getElementById('success-msg');
    if (overlay) overlay.style.display = 'block';
    if (successMsg) successMsg.style.display = 'block';
}

function closeMessage() {
    const overlay = document.getElementById('overlay');
    const successMsg = document.getElementById('success-msg');
    if (overlay) overlay.style.display = 'none';
    if (successMsg) successMsg.style.display = 'none';
    
    const form = document.getElementById('complaint-form');
    if (form) form.reset();
    
    const photoPreview = document.getElementById('photo-preview');
    if (photoPreview) photoPreview.style.display = 'none';
    
    photoUploaded = false;
    
    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = '📤 SUBMIT COMPLAINT';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('complaint-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            const photoInput = document.getElementById('photo');
            
            if (!photoInput.files || photoInput.files.length === 0) {
                e.preventDefault();
                const errorMsg = document.getElementById('error-msg');
                if (errorMsg) {
                    errorMsg.style.display = 'block';
                    errorMsg.textContent = '⚠️ Please upload a photo before submitting.';
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return false;
            }
            
            const submitBtn = document.getElementById('submit-btn');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = '⏳ Submitting...';
            }
        });
    }
});