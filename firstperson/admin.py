from django.contrib import admin
from firstperson.models import *

class StoryAdmin(admin.ModelAdmin):
    filter_horizontal = ['tags', 'places']
    search_fields = ['title', 'name', 'text', 'age', 'tags__name', 'places__name']
    pass

class TagAdmin(admin.ModelAdmin):
    pass

class PlaceAdmin(admin.ModelAdmin):
    pass

admin.site.register(Place, PlaceAdmin)
admin.site.register(Tag, TagAdmin)
admin.site.register(Story, StoryAdmin)