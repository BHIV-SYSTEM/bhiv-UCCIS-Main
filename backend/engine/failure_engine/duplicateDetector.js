const processedSignals =
new Set();

function detectDuplicate(signal_id) {

  if (
    processedSignals.has(signal_id)
  ) {

    return true;
  }

  processedSignals.add(signal_id);

  return false;
}

module.exports =
detectDuplicate;