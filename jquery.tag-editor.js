/*! Tag editor plugin for jQuery.
    https://github.com/hnakamur/jquery.tag-editor
    (c) 2014 Hiroaki Nakamura
    MIT License
 */
(function($, undefined) {
  var tagRegex = /^(.*)[, ]+$/, sepRegex = /[, ]+/m;
  $.fn.tagEditor = function() {
    return this.each(function(i, origElem) {
      var $origElem = $(origElem),
        val = $origElem.val(),
        tags = val ? val.split(sepRegex) : [],
        $tagField, $tagInput, $tagMeasure, $textMeasure,
        createTag = function(tag) {
          return $('<div class="tag-editor-tag">').append(
            $('<div class="tag-editor-text">').text(tag),
            '<a class="tag-editor-delete">x</a>'
          );
        },
        insertTag = function(tag) {
          if (tag && $.inArray(tag, tags) == -1) {
            tags.push(tag);
            $tagInput.before(createTag(tag)).val('');
            updateOrigElemVal();
          } else {
            $tagInput.val('');
          }
          adjustInputWidth('');
        },
        adjustInputWidth = function(val) {
          // To avoid juggling of input widths, we measure text width
          // with one more character.  We use 'W' here because it is
          // a wide character.
          $textMeasure.text(val + 'W');
          $tagInput.css('width', $textMeasure.width());
        },
        updateOrigElemVal = function() {
          $origElem.attr('value', tags.join(','));
        };

      $tagInput = $('<input class="tag-editor-input">').css('width', 0);
      $tagMeasure = createTag('').css({position: 'absolute', left: "-999px"});
      $textMeasure = $tagMeasure.find('.tag-editor-text');
      $tagField = $('<div class="tag-editor-field">').append(
        $tagMeasure,
        $.map(tags, createTag),
        $tagInput
      ).css('width', $origElem.width());
      $origElem.after($tagField).hide();

      $tagField.click(function() {
        $tagInput.focus();
      })
      .on('click', '.tag-editor-delete', function(e) {
        var $textElem = $(e.target).prev(),
          tag = $textElem.text(),
          i = $.inArray(tag, tags);
        if (i != -1) {
          tags.splice(i, 1);
          $textElem.parent().remove();
          updateOrigElemVal();
        }
        return false;
      });

      $tagInput.on('focus', function(e) {
        $tagInput.css('font', $textMeasure.css('font'));
        adjustInputWidth('');
      })
      .on('blur', function(e) {
        var val = $tagInput.val();
        insertTag(val.replace(sepRegex, ''));
        updateOrigElemVal();
      })
      .on('keydown', function(e) {
        var val = $tagInput.val();
        if (!val && e.which == 8 /* Backspace */ && tags.length) {
          tags.pop();
          $tagInput.prev().remove();
          updateOrigElemVal();
        }
      })
      .on('keyup', function(e) {
        var val = $tagInput.val(), matches;
        if (val) {
          matches = tagRegex.exec(val);
          if (matches) {
            // We need to split tag text with separators
            // because text pasted from clipboard may contain those.
            $.each(matches[1].split(sepRegex), function(i, tag) {
              insertTag(tag);
            });
          } else {
            adjustInputWidth(val);
          }
        }
      });

      return $tagField;
    });
  };
}(jQuery));
