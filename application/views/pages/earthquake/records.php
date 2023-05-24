
							<div>
								<div class="bg-dark text-white p-2 border">New Entry <i class="mdi mdi-close float-right custom-btn" id="close_newentry"></i></div>
							</div>
		<div class="pull-right">
	<a href="<?php echo site_url('earthquake/add'); ?>" class="btn btn-success">Add</a> 
</div>

<table class="table table-striped table-bordered">
    <tr>
		<th>RECORDED BY</th>
		<th>ID</th>
		<th>DATE</th>
		<th>TIME</th>
		<th>LOCATION</th>
		<th>REPORTED DAMAGES</th>
		<th>ACTION TAKEN</th>
		<th>Actions</th>
    </tr>

	<?php foreach($earthquake as $e){ ?>
    <tr>
		<td><?php echo $e['RECORDED BY']; ?></td>
		<td><?php echo $e['ID']; ?></td>
		<td><?php echo $e['DATE']; ?></td>
		<td><?php echo $e['TIME']; ?></td>
		<td><?php echo $e['LOCATION']; ?></td>
		<td><?php echo $e['REPORTED DAMAGES']; ?></td>
		<td><?php echo $e['ACTION TAKEN']; ?></td>
		<td>
            <a href="<?php echo site_url('earthquake/edit/'.$e['RECORDED BY']); ?>" class="btn btn-info btn-xs">Edit</a> 
            <a href="<?php echo site_url('earthquake/remove/'.$e['RECORDED BY']); ?>" class="btn btn-danger btn-xs">Delete</a>
        </td>
    </tr>
	<?php } ?>
</table>