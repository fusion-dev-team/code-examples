# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from datetime import datetime  

from django.contrib.auth.models import User
from django.db import models

from sortedm2m.fields import SortedManyToManyField
from ckeditor.fields import RichTextField

from .validators import validate_file_extension, validate_image
  

class News(models.Model):
    title = models.CharField(max_length=200, verbose_name="Title", blank=False)
    date = models.DateTimeField(default=datetime.now, blank=False, verbose_name="Date and Time")
    author = models.ForeignKey(User, default='', verbose_name="Author", blank=False)
    img = models.ImageField(validators=[validate_image], blank=False, default='', verbose_name="Picture for article")

    def __unicode__(self):
            return self.title

    def image_tag(self):
        return u'<img src="/media/%s" height="250" />' % self.img
    image_tag.short_description = 'Miniature of picture'
    image_tag.allow_tags = True
        
    class Meta:
        verbose_name = "Article"
        verbose_name_plural = "News"


class NewsBlocks(models.Model):
    title = models.CharField(max_length=150, verbose_name="Title of article block", blank=True)
    text = RichTextField(verbose_name="Text of article", blank=True)
    file = models.FileField(validators=[validate_file_extension], blank=True, verbose_name="Picture or video")
    label = models.CharField(max_length=150, verbose_name="Title of file", blank=True)
    ext = models.CharField(max_length=5, blank=True)
    news = models.ForeignKey(News, verbose_name="Article", blank=False, default='')
    date = models.DateTimeField(default=datetime.now, blank=False, verbose_name="Date and time")

    def image_tag(self):
        return u'<img src="/media/%s" height="250" />' % self.img
    image_tag.short_description = 'Miniature of picture'

    def __unicode__(self):
            return self.news.title

    def save(self, *args, **kwargs):
        ext = self.file.name.split('.')[-1]
        img_extensions = ['jpg', 'png', 'jpeg'] # and other
        video_extensions = ['avi', 'mpeg4', 'mp4'] # and other
        if ext.lower() in img_extensions:
                self.ext = 'img'
        elif ext.lower() in video_extensions:
                self.ext = 'video'
        return super(NewsBlocks, self).save(*args, **kwargs)

    class Meta:
        verbose_name = "Block of article"
        verbose_name_plural = "Blocks of article
