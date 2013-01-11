from django.db import models

# Create your models here.

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
    age = models.IntegerField()
    aboutyou = models.TextField()
    date = models.DateTimeField()
    tags = models.ManyToManyField(Tag, related_name = 'stories')
    definition = models.TextField() # of virginity

    def __unicode__(self):
        return self.title





