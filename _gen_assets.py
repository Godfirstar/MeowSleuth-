from PIL import Image, ImageDraw, ImageFont
import os
W,H=1920,1080
root=r'C:\Users\FIRST\Desktop\projects'
assets=os.path.join(root,'assets')
os.makedirs(assets,exist_ok=True)
try:
    font_big=ImageFont.truetype('arial.ttf',84)
    font_mid=ImageFont.truetype('arial.ttf',44)
    font_small=ImageFont.truetype('arial.ttf',30)
except:
    font_big=ImageFont.load_default(); font_mid=font_big; font_small=font_big
white=(230,245,255,255)
shots={
 'S01':('反诈雷达','多模态反诈识别引擎'),
 'S02':('三路输入','文本识别 / 截图识别 / 语音识别'),
 'S03':('关键证据锁定','伪造客服话术 / 异常收款账户 / 高频催促转账'),
 'S04':('风险评估','高危预警 87'),
 'S05':('联动守护','已通知监护人'),
 'S06':('处置建议已生成','让诈骗止步于预警'),
}
def make_bg():
    img=Image.new('RGBA',(W,H),(4,8,16,255)); d=ImageDraw.Draw(img,'RGBA')
    for x in range(0,W,60): d.line([(x,0),(x,H)],fill=(20,70,95,80),width=1)
    for y in range(0,H,60): d.line([(0,y),(W,y)],fill=(20,70,95,80),width=1)
    d.ellipse([W*0.22,H*0.15,W*0.78,H*0.85],fill=(0,130,180,28)); return img

def make_ui(shot):
    img=Image.new('RGBA',(W,H),(0,0,0,0)); d=ImageDraw.Draw(img,'RGBA')
    if shot=='S01': d.rounded_rectangle([560,430,1360,650],radius=20,outline=(60,190,220,180),width=2,fill=(10,25,35,80))
    elif shot=='S02':
        xs=[640,960,1280]; labels=['文本','截图','语音']
        for x,l in zip(xs,labels):
            d.rounded_rectangle([x-110,430,x+110,650],radius=18,outline=(70,210,255,200),width=3,fill=(8,26,40,120)); d.text((x-28,680),l,font=font_mid,fill=white)
    elif shot=='S03':
        d.rounded_rectangle([420,260,1500,830],radius=20,outline=(70,210,255,180),width=2,fill=(12,28,42,90))
        cards=[(520,320,'伪造客服话术'),(930,460,'异常收款账户'),(620,620,'高频催促转账')]
        for x,y,t in cards:
            d.rounded_rectangle([x,y,x+360,y+90],radius=12,outline=(80,220,255,210),width=2,fill=(10,34,52,150)); d.text((x+20,y+28),t,font=font_small,fill=white)
    elif shot=='S04':
        d.rounded_rectangle([690,350,1230,760],radius=24,outline=(90,220,255,180),width=2,fill=(8,26,40,110)); d.rounded_rectangle([760,560,1160,700],radius=16,outline=(255,90,90,220),width=3,fill=(60,8,10,150)); d.text((850,602),'高危',font=font_mid,fill=(255,170,170,255))
    elif shot=='S05':
        d.rounded_rectangle([380,260,1160,820],radius=20,outline=(80,220,255,170),width=2,fill=(10,26,40,100)); d.rounded_rectangle([1220,300,1640,760],radius=20,outline=(80,220,255,210),width=2,fill=(14,34,50,130)); d.rounded_rectangle([1260,380,1600,520],radius=14,outline=(80,220,255,220),width=2,fill=(12,40,60,160))
    elif shot=='S06':
        d.rounded_rectangle([440,230,1480,760],radius=20,outline=(80,220,255,190),width=2,fill=(10,28,44,110))
        for i,t in enumerate(['一键核验','一键拦截','一键上报']):
            x=560+i*300; d.rounded_rectangle([x,640,x+220,720],radius=12,outline=(80,220,255,220),width=2,fill=(10,48,70,170)); d.text((x+44,672),t,font=font_small,fill=white)
    return img

def make_hud(shot):
    img=Image.new('RGBA',(W,H),(0,0,0,0)); d=ImageDraw.Draw(img,'RGBA'); cx,cy=W//2,H//2
    for r,a in [(120,180),(220,130),(320,90)]: d.ellipse([cx-r,cy-r,cx+r,cy+r],outline=(55,230,255,a),width=2)
    d.line([(cx-360,cy),(cx+360,cy)],fill=(55,230,255,120),width=1); d.line([(cx,cy-220),(cx,cy+220)],fill=(55,230,255,120),width=1)
    if shot=='S04': d.rectangle([740,420,1180,440],fill=(255,59,48,110)); d.rectangle([740,730,1180,750],fill=(255,59,48,110))
    return img

def make_text(shot,title,sub):
    img=Image.new('RGBA',(W,H),(0,0,0,0)); d=ImageDraw.Draw(img,'RGBA'); d.text((130,90),title,font=font_big,fill=(220,245,255,255)); d.text((132,185),sub,font=font_small,fill=(145,210,235,255))
    if shot=='S04': d.text((880,460),'87',font=font_big,fill=(255,200,200,255))
    if shot=='S06': d.text((730,860),'反诈雷达',font=font_mid,fill=(220,245,255,255))
    return img
for shot,(title,sub) in shots.items():
    make_bg().save(os.path.join(assets,f'{shot}_bg.png'))
    make_ui(shot).save(os.path.join(assets,f'{shot}_ui.png'))
    make_hud(shot).save(os.path.join(assets,f'{shot}_hud.png'))
    make_text(shot,title,sub).save(os.path.join(assets,f'{shot}_text.png'))
print('generated',len(shots)*4,'files')
