## 42GAG FRONTEND

> :warning: Pull requests: aucune erreur ou warning n'est toléré !

### Setup:
Clonez le répo et lancez `npm install && npm start`
Allez sur [http://localhost:3000](http://localhost:3000) pour voir votre version.

#### Récupérez votre cookie de session !
- Allez sur [https://42gag.netlify.app/](https://42gag.netlify.app/) et connectez vous
- Ouvrez la console `cmd + option + i` et tapez `document.cookies`
- Récupérez votre cookie de session (`b5b2a6f36309271f2fe18f52ac7143399c8945d2ef254a0d12c6d0c6c5a`)
- Retournez sur [http://localhost:3000](http://localhost:3000)
- Ouvrez à nouveau la console, et tapez: ``document.cookie = `session=SESSION;max-age=604800;domain=localhost`;`` en remplaçant `SESSION` par votre string de session récupérée sur le site 42gag
- Retirez `/login` dans l'url et reloadez la page.
#### Happy testing !