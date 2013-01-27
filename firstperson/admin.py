from django.contrib import admin
from firstperson.models import *
from tinymce.widgets import TinyMCE
import django.forms as forms

class StoryAdminForm(forms.ModelForm):
    class Meta:
        model = Story
        widgets = {
            'text' : TinyMCE(attrs={'cols' : 100, 'rows' : 40},mce_attrs={'theme' : 'advanced', })
        }
class DefinitionAdmin(admin.ModelAdmin):
    pass
class StoryAdmin(admin.ModelAdmin):
    filter_horizontal = ['tags', 'places']
    search_fields = ['title', 'name', 'text', 'age', 'tags__name', 'places__name']
    form = StoryAdminForm


class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'tagtype', 'nstories')
    list_filter = ('tagtype',)
    fields = ('name', 'tagtype')

class PlaceAdmin(admin.ModelAdmin):
    pass

admin.site.register(Place, PlaceAdmin)
admin.site.register(Tag, TagAdmin)
admin.site.register(Story, StoryAdmin)
admin.site.register(Definition, DefinitionAdmin)
