/**
 *
 * SugarCRM Community Edition is a customer relationship management program developed by
 * SugarCRM, Inc. Copyright (C) 2004-2013 SugarCRM Inc.
 *
 * SuiteCRM is an extension to SugarCRM Community Edition developed by SalesAgility Ltd.
 * Copyright (C) 2011 - 2017 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SUGARCRM, SUGARCRM DISCLAIMS THE WARRANTY
 * OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along with
 * this program; if not, see http://www.gnu.org/licenses or write to the Free
 * Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
 * 02110-1301 USA.
 *
 * You can contact SugarCRM, Inc. headquarters at 10050 North Wolfe Road,
 * SW2-130, Cupertino, CA 95014, USA. or at email address contact@sugarcrm.com.
 *
 * The interactive user interfaces in modified source and object code versions
 * of this program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU Affero General Public License version 3.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License version 3,
 * these Appropriate Legal Notices must retain the display of the "Powered by
 * SugarCRM" logo and "Supercharged by SuiteCRM" logo. If the display of the logos is not
 * reasonably feasible for  technical reasons, the Appropriate Legal Notices must
 * display the words  "Powered by SugarCRM" and "Supercharged by SuiteCRM".
 */

/**
 * @todo take this function to a common email listview object
 * @param {string} actionUrl
 * @param {function} successCallback
 * @param {function} errorCallback
 * @param {string} loadingTitle
 * @param {string} errorMessage
 */
var handleSelectedEmailsListViewItems = function(actionUrl, successCallback, errorCallback, loadingTitle, errorMessage) {

  if(typeof loadingTitle === 'undefined') {
    loadingTitle = SUGAR.language.translate('Emails', 'LBL_LOADING');
  }

  if(typeof errorMessage === 'undefined') {
    errorMessage = 'Error at selected emails handling.';
  }

  var mb = messageBox({backdrop: false});
  mb.setTitle(loadingTitle);
  mb.setBody('<div class="in-progress"><img src="themes/'+SUGAR.themes.theme_name+'/images/loading.gif"></div>');
  mb.hideFooter();
  mb.show();
  mb.on('cancel', function() {
    "use strict";
    mb.remove();
  });


  var query = JSON.parse($('[name=MassUpdate] [name=current_query_by_page]').val());
  var url = 'index.php?module=Emails&action=' + actionUrl;

  var postOpts = {
    "inbound_email_record": query.inbound_email_record,
    "folders_id": query.folders_id,
    "folder": query.folder,
    "uid[]": []
  };

  if(document.MassUpdate.select_entire_list &&
    document.MassUpdate.select_entire_list.value == 1) {
    // Import all emails from mail box
    postOpts.all = true;
  } else {
    postOpts.all = false;
    // import only selected emails from inbox
    $('.listview-checkbox').each(function(i,v) {
      if($(v).is(':checked')) {
        postOpts['uid[]'].push(query.email_uids[i]);
      }
    });
  }

  $.post( url, postOpts).done(function (data) {
    var jsonData = JSON.parse(data);
    mb.hide();
    if(jsonData.response) {
      successCallback(jsonData);
    } else {
      if(errorCallback) {
        errorCallback(jsonData);
      } else {
        console.error(errorMessage + ' Please check the logs for details.');
      }
    }
  }).error(function (data) {
    mb.hide();
    console.error(data);
  });
};

$(document).ready(function () {

  var query = JSON.parse($('[name=current_query_by_page]').val());
  var jQueryBtnEmailsCurrentFolder = $('.btn-emails-current-folder');

  if(typeof query.folder === 'undefined' ||  query.folder === '') {
    jQueryBtnEmailsCurrentFolder.remove();
  } else if(query.folder === null) {
    jQueryBtnEmailsCurrentFolder.html('<span class="glyphicon glyphicon-alert"></span>');
  } else {
    jQueryBtnEmailsCurrentFolder.text(query.folder);
  }

});