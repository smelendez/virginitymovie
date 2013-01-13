from django.conf.urls import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.views.generic.simple import direct_to_template

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'virginity.views.home', name='home'),
    # url(r'^virginity/', include('virginity.foo.urls')),


    url(r'^$', 'django.views.generic.simple.direct_to_template', {'template' : 'index.html'}),
    url(r'^search.html', 'django.views.generic.simple.direct_to_template', {'template' : 'search.html'}),
    url(r'^index.html', 'django.views.generic.simple.direct_to_template', {'template' : 'index.html'}),
    url(r'^api/allstories', 'firstperson.views.stories_basic'),
    url(r'^api/tag/(\d+)/stories', 'firstperson.views.stories_by_tag'),
    url(r'^api/tag/(.+?)/(.+?)/stories', 'firstperson.views.stories_by_tag_name'),
    url(r'^api/tag/(\d+)', 'firstperson.views.tag'),
    url(r'^api/tags/(\w+)', 'firstperson.views.tags_by_category'),
    url(r'^api/search/(.+?)/stories', 'firstperson.views.api_search'),
    url(r'^api/story/(\d+)/tags', 'firstperson.views.tags_by_story'),
    url(r'^api/story/(\d+)', 'firstperson.views.story'),

    url(r'^story/(\d+)/tag/(.+?)/(.+?)/', 'firstperson.views.story_with_tag'),
    url(r'^story/(\d+)', 'firstperson.views.story_page'),
    # Uncomment the admin/doc line below to enable admin documentation:
     url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
     url(r'^admin/', include(admin.site.urls)),
)
urlpatterns += staticfiles_urlpatterns()
