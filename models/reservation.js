/** Reservation for Lunchly */

const moment = require("moment");

const db = require("../db");


/** A reservation for a party */

class Reservation {
  constructor({id, customerId, numGuests, startAt, notes}) {
    this.id = id;
    this.customerId = customerId;
    this.numGuests = numGuests;
    this.startAt = startAt;
    this.notes = notes;
  }

  /** formatter for startAt */

  getformattedStartAt() {
    return moment(this.startAt).format('MMMM Do YYYY, h:mm a');
  }

  /** given a customer id, find their reservations. */

  static async getReservationsForCustomer(customerId) {
    const results = await db.query(
          `SELECT id, 
           customer_id AS "customerId", 
           num_guests AS "numGuests", 
           start_at AS "startAt", 
           notes AS "notes"
         FROM reservations 
         WHERE customer_id = $1`,
        [customerId]
    );

    return results.rows.map(row => new Reservation(row));
  }
  //save reservation//
  async save(){
    if(this.id === undefined){
      const result = await db.query(`insert into reservations (customer_id,num_guests,start_at,notes)
                                    values ($1,$2,$3,$4) returning id`,
                                    [this.customerId,this.numGuests,this.startAt,this.notes])
                                    this.id = result.rows[0].id
    }else{
      await db.query(`update reservations set customer_id=$1, num_guests=$2,start_at=$3,notes=$4 where id=$5`,
                    [this.customerId,this.numGuests,this.startAt,this.notes])
    }

  }
}
  

module.exports = Reservation;
