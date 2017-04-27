import pandas as pd
from sqlalchemy	import create_engine
import sys

reload(sys)
sys.setdefaultencoding('utf-8')

df = pd.read_csv('stadiums_20150302.csv') 

engine = create_engine('sqlite:///mydata.db', echo=True)
df.to_sql('mytable', engine)
