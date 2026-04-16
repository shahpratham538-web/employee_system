from django.db import migrations
from django.contrib.auth.hashers import make_password

def create_superuser(apps, schema_editor):
    User = apps.get_model('accounts', 'User')
    if not User.objects.filter(username='admin').exists():
        User.objects.create(
            username='admin',
            email='admin@example.com',
            password=make_password('admin123'),
            is_superuser=True,
            is_staff=True,
            role='HR'
        )

class Migration(migrations.Migration):
    dependencies = [
        ('accounts', '0003_user_bio_user_phone_user_profile_picture'),
    ]
    operations = [
        migrations.RunPython(create_superuser),
    ]
