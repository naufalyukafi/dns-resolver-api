import mongoose from 'mongoose';
import paginate from '@models/plugins/paginate.plugin';
import toJSON from '@models/plugins/toJSON.plugin';

const domainSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    spf: {
      valid: {
        type: Boolean,
        default: false,
      },
      record: {
        type: [String],
        default: [],
      },
    },
    dkim: {
      valid: {
        type: Boolean,
        default: false,
      },
      record: {
        type: [String],
        default: [],
      },
    },
    dmarc: {
      valid: {
        type: Boolean,
        default: false,
      },
      record: {
        type: [String],
        default: [],
      },
    },
  },
  {
    timestamps: true,
  },
);

domainSchema.plugin(toJSON);
domainSchema.plugin(paginate);

const Domain = mongoose.model('Domain', domainSchema);

export default Domain;
