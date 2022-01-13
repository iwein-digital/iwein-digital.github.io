from lxml import etree as et 
import json 
import codecs
import os 
import re 
import requests 

tei_folder = "EditionIwein/texts/"

def tei(tag):
    return '{http://www.tei-c.org/ns/1.0}' + tag
def hei(tag):
    return '{https://digi.ub.uni-heidelberg.de/schema/tei/heiEDITIONS}' + tag

def getContent(element):
    result = ''
    # Elements with no text and no tail
    if element.tag in [tei(x) for x in 'l']:
        for el in element.getchildren():
            if el.tag == tei('lb'):
                result += ' '        
            else:
                result += getContent(el)
    # Elements with no tail
    elif element.tag in [tei(x) for x in ['w', 'c','abbr']]:
        if element.text is not None:
            result += element.text
        for el in element.getchildren():
            result += getContent(el)
    # Elements with tail and children and no text
    elif element.tag in [tei(x) for x in ['choice']]:
        for el in element.getchildren():
            result += getContent(el)
        if element.tail is not None:
            tailnws = re.sub('\s', '', element.tail)
            result += tailnws
    # Special cases
    # The lb is handled as space when direct child of l, above. Here is where is inside other elements, we use a -
    elif element.tag in [tei(x) for x in ['lb']]:
        if element.tail is not None:
            tailnws = re.sub('\s', '', element.tail)
            result += tailnws
    # All
    elif element.tag in [tei(x) for x in ['am', 'g', 'orig', 'add', 'del', 'seg', 'hi', 'damage', 'unclear']] + [hei(x) for x in ['initial']]:
        if element.text is not None:
            result += element.text.rstrip().lstrip()
        for el in element.getchildren():
            result += getContent(el)
        if element.tail is not None:
            tailnws = re.sub('\s', '', element.tail)
            result += tailnws
        
    return result

    

entities = requests.get('https://digi.ub.uni-heidelberg.de/schema/tei/heiEDITIONS/declarations/heieditions-entities.txt').text
entities = re.findall('!ENTITY (\w+) "([^"]+)"', entities) 
# entities = {'&'+x[0]: x[1] for x in entities}



final = {'order': [], 'content': {}}
for index, file in enumerate(sorted(os.listdir(tei_folder))):
    print(file)
    if file[-4:] != '.xml':
        continue
    if index < 1000:
        # if file != 'Iwein_z_Nelahozevescopy.xml':
        #     continue
        with codecs.open(tei_folder + file, 'r', 'utf-8') as input:
            filestring = input.read()
            filestring = filestring.replace('<?xml version="1.0" encoding="UTF-8"?>', '')
            filestring = re.sub('<\?xml-model .+',
                            '',
                            filestring)
            # filestring = re.sub('<DOCTYPE .+',
            #                 '',
            #                 filestring)
            
            for entity in entities:
                filestring = filestring.replace('&'+entity[0]+';', entity[1])
            # print(filestring[:1000])
            root = et.fromstring(filestring)
            result = {}
            order = {}
            for verse in root.iter(tei('l')):
                if 'n' in verse.attrib:
                    content = getContent(verse)
                    result[verse.attrib['n']] = content
                    if hei('altN') in verse.attrib:
                        order[verse.attrib[hei('altN')]] = verse.attrib['n']
                else:
                    print('Vers ohne Nummer: '+ file + verse.text)
            final['content'][file[6:]] = result
            final['order'].append({'wit':file[6:], 'order': order}) 
                
with codecs.open('EditionIwein/arbeitssynopse/synopse.json', 'w', 'utf-8') as f:
    json.dump(final, f)
            




