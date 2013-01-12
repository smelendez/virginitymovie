from django.http import HttpResponse
from django.core import serializers
# Create your views here.
from firstperson.models import *

def stories_by_tag_name(request, tagname, tagcat):
    tag = Tag.objects.get(name=tagname, tagtype=tagcat)

    stories = tag.stories.all()

    return HttpResponse(serializers.serialize('json', stories, fields = ('link',)))
def stories_basic(request):
    data = serializers.serialize('json', Story.objects.all(), fields = ('id', 'name', 'title', 'firstgraf', 'minage', 'maxage', 'aboutyou', 'link', 'definition'))
    return HttpResponse(data)
    
def stories_by_tag(request, tagid):
    tag = Tag.objects.get(id=tagid)
    stories = tag.stories.all()
    data = serializers.serialize('json', stories, fields = ('link',))
    return HttpResponse(data)

def tags_by_category(request, category):
    tags = Tag.objects.filter(tagtype=category)
    data = serializers.serialize('json', tags)
    return HttpResponse(data)

def tag(request, tagid):
    tag = Tag.objects.get(id=tagid)
    data = serializers.serialize('json', [tag])
    return HttpResponse(data)

def tags_by_story(request, storyid):
    story = Story.objects.get(id=storyid)
    tags = story.tags.all()
    data = serializers.serialize('json', tags)
    return HttpResponse(data)

def story(request, storyid):
    story = Story.objects.get(id=storyid)
    data = serializers.serialize('json', [story])
    return HttpResponse(data)



    
