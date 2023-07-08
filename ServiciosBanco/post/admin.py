from django.contrib import admin
from post.models import Cliente

# Register your models here.
@admin.register(Cliente)
class PostAdmin(admin.ModelAdmin):
    list_display:('nombre','telefono','cuenta_bancaria')



def registro_llamadas(request):
    if request.method == 'POST':
        form = RegistroLlamadasForm(request.POST)
        if form.is_valid():
            form.save()
    else:
        form = RegistroLlamadasForm()
    return render(request, 'registro_llamadas.html', {'form': form})

