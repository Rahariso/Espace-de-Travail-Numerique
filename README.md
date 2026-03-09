# Installation de l’environnement (XAMPP, PHP, Composer, Git, Laravel)

## 1. Installer XAMPP

Télécharger et installer **XAMPP** pour obtenir **PHP, Apache et MySQL**.

---

## 2. Ajouter PHP dans les variables d’environnement

1. Aller dans le dossier :

```
C:\xampp\php
```

2. Copier ce chemin.

3. Ajouter le chemin dans **Variables d’environnement → Variables système → Path**.

---

## 3. Vérifier la version de PHP

Ouvrir **Invite de commandes (CMD)** puis exécuter :

```
php -v
```

Si PHP est correctement configuré, la version de PHP s’affichera.

---

## 4. Installer Composer

Télécharger **Composer** depuis :

[https://getcomposer.org/](https://getcomposer.org/)

Installer Composer normalement.

---

## 5. Vérifier l’installation de Composer

Dans **CMD**, exécuter :

```
composer -v
```

---

## 6. Préparer PHP avant l’installation de Laravel

Avant d’installer Laravel :

* Activer l’extension **ZIP** dans PHP
* Installer **Git**

### Activer l’extension ZIP

1. Ouvrir le fichier :

```
C:\xampp\php\php.ini
```

2. Rechercher la ligne :

```
;extension=zip
```

3. Supprimer le **;** pour obtenir :

```
extension=zip
```

4. Enregistrer le fichier.

---

## 7. Vérifier que ZIP est activé

Dans **CMD**, exécuter :

```
php -m
```

La liste doit contenir :

```
zip
```

---

## 8. Installer Git

Télécharger **Git** :

[https://git-scm.com/](https://git-scm.com/)

Puis vérifier l’installation :

```
git --version
```

---

## 9. Installer Laravel

Créer un dossier pour le projet, puis ouvrir **PowerShell** dans ce dossier et exécuter :

```
composer create-project laravel/laravel backend
```

Cela va créer un projet **Laravel** nommé **backend**.

---


comme dans les projets **professionnels sur GitHub**.
