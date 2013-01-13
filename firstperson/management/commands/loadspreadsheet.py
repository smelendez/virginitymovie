#!/usr/bin/python

from django.core.management.base import BaseCommand, CommandError
from firstperson.models import *
from bs4 import BeautifulSoup
import datetime
import re
import unicodecsv as csv
import urllib2

class Command(BaseCommand):
    args = '<spreadsheet key> <xmlfile>'
    help = 'Loads data in from spreadsheet, xml file'

    def handle(self, *args, **options):
        if args:
            key = args[0]
            xmlfile = args[1]
        else:
            raise CommandError('Usage: python manage.py loadspreadsheet <key> <xmlfile>')

        spreadsheet_url = 'https://spreadsheets.google.com/pub?key=%s&output=csv&ndplr=1' % key

        page = urllib2.urlopen(spreadsheet_url)

        reader = csv.DictReader(page)

        soup = BeautifulSoup(file(xmlfile))

        content = {}

        for item in soup("item"):
            content[item.link.text] = item.find('content:encoded').text.replace("\r","<br />")
            
            
            




        for row in reader:
            name = row['title1']
            if ':' in name:
                # Of form First Person: Rosie
                name = name.split(':')[1].strip()
            title = row['title2']
            firstgraf = row['firstgraf']
            aboutyou = row['aboutyou']
            date = row['date']
            existingcats = row['Existing Categories']
            demographic = row['New Tags (Demographic)']
            emotional = row['New Tags (Emotional)']
            phrases = row['New Tags (Phrases)']
            definition = row['virginity definition']
            location = row['location']
            link = row['link']
            age = row['age']
            year, month, day = [int(x) for x in date.split('.')]
            date = datetime.date(year, month, day)

            story = Story.objects.get_or_create(link=link, date = date)[0]



            story.name = name
            story.title = title
            story.text = content[link]
            story.firstgraf = firstgraf
            story.aboutyou = aboutyou
            story.definition = definition

            if age:
                if '-' in age:
                    story.minage, story.maxage = map(int, age.split("-"))
                else:
                    story.minage = story.maxage = int(age)


            
            for cat in existingcats.split(','):
                cat = cat.lower().strip()
                if not cat:
                    continue

                tag = Tag.objects.get_or_create(name=cat, tagtype='existing')[0]
                tag.nstories+=1

                story.tags.add(tag)
                tag.save()

            for cat in location.split(','):
                cat = cat.lower().strip()

                if not cat:
                    continue

                place = Place.objects.get_or_create(name=cat)[0]
                story.places.add(place)
                
            for cat in demographic.split(','):
                cat = cat.lower().strip()
                if not cat:     
                    continue
                cat = re.sub("\s+", " ", cat)


                tag = Tag.objects.get_or_create(name=cat, tagtype='demographic')[0]
                tag.nstories+=1
                tag.save()

                story.tags.add(tag)

            for cat in emotional.split(','):
                cat = cat.lower().strip()
                if not cat:     
                    continue
                cat = re.sub("\s+", " ", cat)
                tag = Tag.objects.get_or_create(name=cat, tagtype='emotional')[0]
                tag.nstories+=1
                tag.save()

                story.tags.add(tag)
            for cat in phrases.split(','):
                cat = cat.lower().strip()
                if not cat:     
                    continue
                cat = re.sub("\s+", " ", cat)
                tag = Tag.objects.get_or_create(name=cat, tagtype='phrases')[0]
                tag.nstories+=1
                tag.save()

                story.tags.add(tag)

            story.save()


            
                



            








            




        







