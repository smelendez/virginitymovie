from django.db import models

# Create your models here.

class Place(models.Model):
    name = models.CharField(max_length = 200)

    def __unicode__(self):
        return self.name

class Tag(models.Model):
    name = models.CharField(max_length = 200)
    tagtype = models.CharField(max_length = 200)

    def __unicode__(self):
        return self.name
    class Meta:
        unique_together = ("name", "tagtype")


class Story(models.Model):
    name = models.CharField(max_length = 100)
    title = models.CharField(max_length = 200)
    firstgraf = models.TextField()
    minage = models.IntegerField(null=True)
    maxage = models.IntegerField(null=True)
    aboutyou = models.TextField()
    link = models.URLField(max_length = 200, unique=True)
    date = models.DateField()
    tags = models.ManyToManyField(Tag, related_name = 'stories')
    places = models.ManyToManyField(Place, related_name = 'stories')
    definition = models.TextField() # of virginity
    text = models.TextField()

    def __unicode__(self):
        return self.title

    class Meta:
        verbose_name_plural = 'Stories'





