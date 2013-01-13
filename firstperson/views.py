from django.template import Context, Template
from django.template.loader import get_template

from django.http import HttpResponse
from django.core import serializers
# Create your views here.
from firstperson.models import *

def api_search(request, searchterm):
    stories = Story.objects.filter(text__icontains=searchterm)
    return HttpResponse(serializers.serialize('json', stories, fields = ('link',)))

def stories_by_tag_name(request, tagname, tagcat):
    tag = Tag.objects.get(name=tagname, tagtype=tagcat)
    stories = tag.stories.all()
    return HttpResponse(serializers.serialize('json', stories, fields = ('link',)))

def story_page(request, storyid):
    story = Story.objects.get(id=storyid)
    t = get_template('storypage.html')
    html = t.render(Context({'story' : story}))

    return HttpResponse(html)

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

def story_with_tag(request, storyid, tagname, tagcat):
    story = Story.objects.get(id=storyid)
    tag = Tag.objects.get(name=tagname, tagtype=tagcat)
    tagid = tag.pk
    t = get_template('storypage.html')
    stories = tag.stories.all()

    nstories = len(stories)

    for i, tagstory in enumerate(stories):
        if str(tagstory.pk) == str(storyid):
            storyindex = i
            break

    if storyindex == 0:
        prevlink = None
        nextlink = "/stories/%s/%s" % (stories[1], tagid)
    elif storyindex == nstories-1:
        prevlink = "/stories/%s/%s" % (stories[storyindex-1], tagid)
        nextlink = None
    else:
        prevlink = "/stories/%s/%s" % (stories[storyindex-1], tagid)
        nextlink = "/stories/%s/%s" % (stories[storyindex+1], tagid)
        

    html = t.render(Context({'story' : story, 'prevlink' : prevlink, 'nextlink' : nextlink, 'tag': tag, 'thisnum' : storyindex+1, 'totalnum' : nstories}))
    return HttpResponse(html)




    
    







    
