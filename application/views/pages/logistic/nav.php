<div id="firstloading" style="position:absolute;top:0;left:0;z-index:9999;height: 100%;width: 100%;background-color: #fff;">
	<div style="left: 50%; bottom: 50%; transform: translate(-50%, 47%); z-index: 9999;position: absolute;"><i class="mdi mdi-autorenew mdi-spin" style="font-size: 200px;color:#282923;"></i></div>
</div>
<div class="ui blue inverted top fixed menu nav" id="nav-get-user" data-uid="<?php echo $uid; ?>" data-utype="<?php echo $utype; ?>">
	<div class="item"><strong>CDRRMD</strong> - <small>Logistcs</small></div>
	<a class="item <?php echo ($page == 'logs'?'active':''); ?>" href="logs">Logs</a>
	<a class="item <?php echo ($page == 'items'?'active':''); ?>" href="items">Item List</a>
	<?php if( $utype != 'viewer' ) : ?>
		<a class="item <?php echo ($page == 'import-list'?'active':''); ?>" href="import-list">Import List</a>
	<?php endif; ?>

	<div class="right menu">
		<div class="ui dropdown item">
			<?php echo strtoupper($utype); ?> - <?php echo strtoupper($uname); ?>
			<i class="dropdown icon"></i>
			<div class="menu">
				<a class="item" href="<?php echo base_url(); ?>logistic/logout"><i class="sign-out icon"></i>Logout</a>
			</div>
		</div>
		<!-- <a class="ui item" id="openpopupadmin">Admin Access</a> -->
	</div>
</div>