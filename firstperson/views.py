from django.http import HttpResponse
from django.core import serializers
# Create your views here.
from firstperson.models import *

def stories_basic(request):

    data = serializers.serialize('json', Story.objects.all(), fields = ('id', 'name', 'title', 'firstgraf', 'minage', 'maxage', 'aboutyou', 'link', 'definition')
    return HttpResponse(data)
    
def stories_by_tag(request, tagid):
    pass

    
