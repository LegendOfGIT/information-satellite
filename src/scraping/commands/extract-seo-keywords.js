module.exports = (context = {}, parameters = {}) => new Promise(resolve => {
    const { contextId, sourceContextId } = parameters;

    console.log('executing command "extract-seo-keywords"');

    if (!contextId) {
        console.log('required parameter "contextId" is not given. abort.');
        resolve();
    }

    if (!sourceContextId) {
        console.log('required parameter "sourceContextId" is not given. abort.');
        resolve();
    }

    const sourceContextIds = Array.isArray(sourceContextId) ? sourceContextId : [sourceContextId];

    const sourceContexts = sourceContextIds.map(sourceContextId => Object.call(context, sourceContextId) ? context[sourceContextId] || '' : '');
    if (!sourceContexts || !sourceContexts.filter(sourceContext => sourceContext).length) {
        console.log(`no context for keyword extraction.`);
        resolve();
    }

    const stopWords = (
        '\\u2013,'+
        'ab,aber,alle,allem,allen,aller,allerdings,als,also,am,an,andere,anderem,anderen,anderer,andernfalls,anders,andersherum,anfangs,anhand,anschließend,ansonsten,anstatt,auch,auf,aufgrund,aus,außerdem,' +
        'befindet,bei,beide,beim,beispielsweise,bereits,besonders,besteht,bestimmte,bestimmten,bestimmter,bevor,bietet,bis,bleiben,bringen,bringt,bsp,bzw,' +
        'cm,' +
        'd.h,da,dabei,dafür,daher,damit,danach,dann,dar,daran,darauf,daraus,darf,darstellt,darüber,das,dass,davon,dazu,dem,demzufolge,den,denen,denn,der,deren,des,dessen,desto,die,dir,dies,diese,diesem,diesen,dieser,dieses,doch,dort,durch,' +
        'ebenfalls,egal,eher,eigenen,eigentlich,ein,eine,einem,einen,einer,eines,einigen,einiges,einmal,einzelnen,enthalten,entscheidend,entweder,er,erstmals,es,etc,etwas,euch,' +
        'fällt,folgende,folgendem,folgenden,folgender,folgendes,folgt,für,' +
        'ganz,gegen,gehen,gemacht,genannte,genannten,gerade,gerne,gibt,gilt,gleich,gleichen,gleichzeitig,' +
        'habe,haben,hält,hat,hatte,hätte,hauptsächlich,her,heutigen,hier,hierbei,hierfür,hin,hingegen,hinzu,hoch,' +
        'ihn,ihr,ihre,ihren,ihrem,ihrer,im,immer,immerhin,in,indem,insgesamt,ist,' +
        'ja,je,jede,jedem,jeder,jedes,jedoch,jetzt,jeweilige,jeweiligen,jeweils,' +
        'kam,kann,keine,kommen,kommt,können,konnte,könnte,konnten,' +
        'lassen,lässt,lautet,lediglich,leider,letztendlich,letztere,letzteres,liebt,liegt,' +
        'machen,macht,mal,man,mehr,mehrere,meine,meinem,meisten,mich,mit,mithilfe,mittels,möchte,möglich,möglichst,momentan,muss,müssen,musste,' +
        'nach,nachdem,nächsten,nahezu,nämlich,natürlich,nein,neue,neuen,nicht,nichts,noch,nun,nur,' +
        'ob,obwohl,oder,oftmals,ohne,' +
        'per,' +
        'sämtliche,scheint,schon,sehr,sein,seine,seinem,seinen,sich,sicherlich,sie,siehe,sind,so,sobald,sofern,solche,solchen,soll,sollen,sollte,sollten,somit,sondern,sorgt,sowie,sowohl,später,sprich,statt,' +
        'trotz,' +
        'über,überhaupt,um,und,uns,unser,unsere,unserer,unter,usw,' +
        'viel,viele,vielen,völlig,vom,von,vor,vorerst,vorher,' +
        'während,war,wäre,waren,warum,was,weil,weitere,weiteren,weiterer,weiteres,weiterhin,welche,welchen,welcher,welches,wenn,wer,werden,wesentlich,wichtige,wichtigsten,wie,wieder,wiederum,will,wir,wird,wirklich,wo,wobei,worden,wurde,wurden,' +
        'z.b,ziemlich,zu,zuerst,zum,zur,zusätzlich,zuvor,zwar,zwecks').split(',');

    let terms = sourceContexts.join(' ').toLowerCase();
    stopWords.forEach(stopWord => {
        terms = terms.replaceAll(' ' + stopWord + ' ', ' ');
        terms = terms.replaceAll(new RegExp(' ' + stopWord + '(!|\\)|\\.|,|:)', 'g'), '');
    });

    terms = terms
        .replaceAll(/(\.|:|,|!|;|'|")/g, '')
        .replaceAll('-', ' ');

    const termCountMap = {};
    terms.split(' ').filter(term => -1 === stopWords.indexOf(term)).filter(term => term.length > 2).forEach(term => {
        const c = termCountMap[term] ? termCountMap[term] : 0;
        termCountMap[term] = c + 1;
    });

    const maximumKeywords = 4;
    const keywords = [];
    const highestCounts = Object.values(termCountMap)
            .filter((value, index, array) => array.indexOf(value) === index)
            .sort((a, b) => b-a);

    highestCounts.forEach(highestCount => {
        Object.keys(termCountMap).forEach(key => {
            if (highestCount === termCountMap[key]) {
                keywords.push(key);
            }
        });
    });

    context[contextId] = keywords.splice(0, maximumKeywords).join('|');

    resolve();
});

