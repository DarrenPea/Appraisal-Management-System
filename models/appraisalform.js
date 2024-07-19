const db = require('./db.js');
const tableName = 'appraisalform';

class AppraisalForm {
    constructor(
      formID,
      staffID,
      statusEmployee,
      statusHOD,
      formDateUploaded,
      a1,
      a2_1,
      a2_2,
      a2_3,
      a2_4,
      a2_5,
      a2_6,
      a2_7,
      a2_8,
      a3_1,
      commentsA3_1,
      a3_2,
      commentsA3_2,
      a3_3,
      commentsA3_3,
      a3_4,
      commentsA3_4,
      a3_5,
      commentsA3_5,
      a3_6,
      commentsA3_6,
      a3_7,
      commentsA3_7,
      a3_8,
      commentsA3_8,
      a3_9,
      commentsA3_9,
      a3_10,
      commentsA3_10,
      a3_11,
      commentsA3_11,
      a3_12,
      commentsA3_12,
      a3_13,
      commentsA3_13,
      a3_14,
      commentsA3_14,
      a3_15,
      commentsA3_15,
      a3_16,
      commentsA3_16,
      a3_17,
      commentsA3_17,
      a3_18,
      commentsA3_18,
      a3_19,
      commentsA3_19,
      a3_20,
      commentsA3_20,
      b
    ) {
      this.formID = formID;
      this.staffID = staffID;
      this.statusEmployee = statusEmployee;
      this.statusHOD = statusHOD;
      this.formDateUploaded = formDateUploaded;
      this.a1 = a1;
      this.a2_1 = a2_1;
      this.a2_2 = a2_2;
      this.a2_3 = a2_3;
      this.a2_4 = a2_4;
      this.a2_5 = a2_5;
      this.a2_6 = a2_6;
      this.a2_7 = a2_7;
      this.a2_8 = a2_8;
      this.a3_1 = a3_1;
      this.commentsA3_1 = commentsA3_1;
      this.a3_2 = a3_2;
      this.commentsA3_2 = commentsA3_2;
      this.a3_3 = a3_3;
      this.commentsA3_3 = commentsA3_3;
      this.a3_4 = a3_4;
      this.commentsA3_4 = commentsA3_4;
      this.a3_5 = a3_5;
      this.commentsA3_5 = commentsA3_5;
      this.a3_6 = a3_6;
      this.commentsA3_6 = commentsA3_6;
      this.a3_7 = a3_7;
      this.commentsA3_7 = commentsA3_7;
      this.a3_8 = a3_8;
      this.commentsA3_8 = commentsA3_8;
      this.a3_9 = a3_9;
      this.commentsA3_9 = commentsA3_9;
      this.a3_10 = a3_10;
      this.commentsA3_10 = commentsA3_10;
      this.a3_11 = a3_11;
      this.commentsA3_11 = commentsA3_11;
      this.a3_12 = a3_12;
      this.commentsA3_12 = commentsA3_12;
      this.a3_13 = a3_13;
      this.commentsA3_13 = commentsA3_13;
      this.a3_14 = a3_14;
      this.commentsA3_14 = commentsA3_14;
      this.a3_15 = a3_15;
      this.commentsA3_15 = commentsA3_15;
      this.a3_16 = a3_16;
      this.commentsA3_16 = commentsA3_16;
      this.a3_17 = a3_17;
      this.commentsA3_17 = commentsA3_17;
      this.a3_18 = a3_18;
      this.commentsA3_18 = commentsA3_18;
      this.a3_19 = a3_19;
      this.commentsA3_19 = commentsA3_19;
      this.a3_20 = a3_20;
      this.commentsA3_20 = commentsA3_20;
      this.b = b;
    }
  }
