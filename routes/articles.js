var express = require("express");
var router = express.Router();
var Article = require("../models/article");
var commentRouter = require("./comments");
var Comment = require("../models/comment");

//get all articlers

router.get("/", (req, res, next) => {
  Article.find({}, (err, articles) => {
    if (err) return next(err);
    var {userName} = req.session;
    res.render("allArticles", { articles,userName });
  });
});

//get create aticle form

router.get("/new", (req, res, next) => {
  res.render("form");
});

//post article

router.post("/", (req, res, next) => {
  Article.create(req.body, (err, article) => {
    if (err) return next(err);
    res.redirect("/articles");
  });
});

//get single Article//get the comments also

router.get("/:id", (req, res, next) => {
  var id = req.params.id;
  Article.findById(id)
    .populate("comments")
    .exec((err, article) => {
      if (err) return next(err);
      res.render("userDetails", { article });
    });
});

// get update article form

router.get("/:id/edit", (req, res, next) => {
  Article.findById(req.params.id, (err, article) => {
    if (err) return next(err);
    res.render("updateDetails", { article });
  });
});

//edit an article

router.post("/:id/edit", (req, res, next) => {
  var id = req.params.id;
  console.log(id);
  Article.findByIdAndUpdate(id, req.body, (err, updatedArticle) => {
    if (err) return next(err);
    res.redirect("/articles");
  });
});

//put an article
router.get("/:id", (res, req, next) => {
  var id = req.params.id;
  Article.findByIdAndUpdate(id, req.body, (err, article) => {
    if (err) return next(err);
    res.render("userDetails", { article });
  });
});

//delete an article

router.get("/:id/delete", (req, res, next) => {
  var id = req.params.id;
  Article.findByIdAndDelete(id, (err, article) => {
    if (err) return next(err);
    res.redirect("/articles");
  });
});

//likes
router.get("/:id/likes", (req, res, next) => {
  var id = req.params.id;
  Article.findByIdAndUpdate(
    id,
    { $inc: { likes: 1 } },
    { new: true },
    (err, article) => {
      if (err) return next(err);
      res.redirect(`/articles/${id}`);
    }
  );
});

//comments
// router.use('/',commentRouter);
router.post("/:articleId/comments", (req, res, next) => {
  var articleId = req.params.articleId;
  console.log(articleId, "Article ID in comments");

  req.body.articleId = req.params.articleId;
  Comment.create(req.body, (err, createdComment) => {
    if (err) return next(err);
    Article.findByIdAndUpdate(
      articleId,
      { $push: { comments: createdComment.id } },
      (err, article) => {
        if (err) return next(err);
        res.redirect(`/articles/${article.id}`);
      }
    );
  });
});

//comment edit form
router.get("/:articleId/comments/:commentId/edit", (req, res, next) => {
  console.log("working");
  var articleId = req.params.articleId;
  var commentId = req.params.commentId;
  // req.body.articleId = req.params.articleId;
  Comment.findById(commentId, (err, comments) => {
    if (err) return next(err);
    Article.findById(articleId, (err, articles) => {
      if (err) return next(err);
      res.render("updateCommits", { comments, articles });
    });
  });

  // res.render("editCommentForm");
});

//post commit
router.post("/:articleId/comments/:commentId/edit", (req, res, next) => {
  var ids = req.params.articleId;
  var commentId = req.params.commentId;
  Comment.findByIdAndUpdate(
    commentId,
    req.body,
    { new: true },
    (err, comments) => {
      if (err) return next(err);
      res.redirect(`/articles/${ids}`);
    }
  );
});

// delete comment
router.get("/:articleId/comments/:commentId/delete", (req, res, next) => {
  var ids = req.params.articleId;
  var commentId = req.params.commentId;
  console.log(ids, "comment IDs in delete");

  console.log(req.url, "comment ID url");
  Comment.findByIdAndDelete(commentId, (err, comment) => {
    console.log(comment);
    if (err) return next(err);
    Article.findByIdAndUpdate(
      ids,
      { $pull: { comments: comment.id } },
      (err, article) => {
        if (err) return next(err);
        res.redirect(`/articles/${ids}`);
      }
    );
  });
});

//update

module.exports = router;
